import * as https from "https";
import * as url from "url";
import * as fs from "fs";

function get<T>(urlS: string) {
  return new Promise<T>((res, rej) => {
    https.get(
      Object.assign({}, url.parse(urlS), { headers: { accept: "application/json" } } as https.RequestOptions),
      req => {
        let obj = "";
        req.setEncoding("utf8");
        req.on("data", data => {
          obj += data;
        });
        req.on("end", () => {
          let data = JSON.parse(obj);
          if (req.statusCode == 404) {
            rej(data);
          } else res(data);
        });
        req.on("error", err => {
          rej(err);
        });
      }
    );
  });
}

get<APIRootObject>("https://www.thebluealliance.com/swagger/api_v3.json")
  .then(data => {
    console.log(data.info.version)
    let paths: KeyVal<needPath> = {};
    let pars = data.parameters;
    for (const key in data.paths) {
      let path = data.paths[key].get;
      let nKey= key.replace(/{/g,'${')
      paths[nKey] = {
        par: path.parameters
          .map(par => {
            let parRef = par.$ref.split("/");
            let parKey = parRef[parRef.length - 1];
            let parData = pars[parKey];
            return {
              key: parKey,
              type: parData.type,
              description: parData.description,
              required:parData.required
            };
          })
          .filter(a => pars[a.key].in == "path"),
        description: path.description,
        returnType: buildProperty(path.responses["200"].schema),
        name: getEndpointName(key)
      };
      addEndpoint(nKey, paths[nKey]);
    }
    return {
      host: data.host,
      basePath: data.basePath,
      security: data.securityDefinitions,
      paths,
      types: data.definitions
    } as need;
  })
  .then(async data => {
    let file = await fsRead("template.ts");
    file = replace(file, {
      host: '"'+data.host+'"',
      basePath: '"'+data.basePath+'"',
      apiKeyName: '"'+data.security.apiKey.name+'"',
      paths: getEndpoints(),
      types: buildTypes(data.types)
    });
    fs.writeFile('client/genAPI.ts',file,'utf8',err=>{if(err)throw err;console.log('DONE')})
  }).catch(err=>{
    console.error(err)
  })


function replace(s: string, rep: KeyVal<string>) {
  return s.replace(new RegExp(`\\/\\/(.*){{(\\w+)}}`, "g"), (st, a1, a2) => {
    return a1 + (rep[a2]||'');
  });
}
let KeyValTest = /key-val[\w\s`]+ the ([\w\s]+) as/;


function fsRead(path: string) {
  return new Promise<string>((res, rej) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) rej(err);
      else res(data);
    });
  });
}

interface need {
  host: string;
  basePath: string;
  security: SecurityDefinitions;
  paths: KeyVal<needPath>;

  types: KeyVal<IDefinition>;
}
interface needPath {
  description: string;
  name: string;
  par: {
    key: string;
    type: string;
    description: string;
    required:boolean
  }[];
  returnType: string;
}
interface dataGroup {
  key: string;
  data: needPath;
  parTree: KeyVal<ParNode>;
  linked: { key: string; data: needPath }[];
}
let t: KeyVal<dataGroup> = {};
function addEndpoint(key: string, data: needPath) {
  let name = data.name;
  let tags = data.par.map(a => a.key.replace("_", "/"));
  for (let i = 0; i < tags.length; i++) {
    if (key.includes(tags[i])) {
      let partialTag = tags[i].split("/");
      if (partialTag.length == 2) {
        let tag = partialTag[1];
        tag = tag[0].toUpperCase() + tag.slice(1);
        data.name = name = name.replace(tag, "");
      }
    }
  }
  data.par.push({key:'onCashExpire',type:`getPromise<${data.returnType}>`,description:'Get new promise once the cash expires',required:false})
  if (typeof t[name] != "undefined") {
    t[name].linked.push({ key, data });
    addParToTree(t[name].parTree, data.par.map(a => {return {type:a.type,req:a.required}}), key);
  } else t[name] = { key, data, linked: [], parTree: addParToTree({}, data.par.map(a => {return {type:a.type,req:a.required}}), key) };
}
function getEndpoints() {
  let s = "";
  for (const key in t) {
    let {data:endData,linked,parTree,key:endKey} = t[key];
    let typeArr = endData.par.map(par =>{ return { types:[par.type],required:par.required}});
    s += buildFunctionCaller(endData);
    for (let i = 0; i < linked.length; i++) {
      s += buildFunctionCaller(linked[i].data);
      linked[i].data.par.map((par, index) => {
        if (typeof typeArr[index] == "undefined") typeArr[index] = {types:[par.type],required:false};
        else{
          if(!typeArr[index].types.includes(par.type))typeArr[index].types.push(par.type);
          typeArr[index].required = typeArr[index].required && par.required
        }
      });

    }
    if(linked.length>0){
      console.log({multi:endData.name})
      let req=true
      s+=`\n${endData.name}(${typeArr.map((a,c)=>`par${c+1}${(req=req&&a.required)?'':'?'}: ${[...new Set(a.types)].sort((a,b)=>a.length-b.length).join(' | ')}`).join(',')}){
        ${buildMultiCaller({next:parTree,key:'root'})}
      }\n`
    }else{
      s+=`{
        return this.TBAGet(\`${endKey}\`,onCashExpire)
      }\n`
    }
  }
  return s;
}

function addParToTree(node: KeyVal<ParNode>, type: {type:string,req:boolean}[], dest: string, index = 0,top?:number) {
  if (type.length > index) {
    const curType = (type[index].req?'':'?')+type[index].type
    if (typeof node[curType] == "undefined") node[curType] = { next: addParToTree({}, type, dest, index + 1),key:type[index].type };
    else addParToTree(node[curType].next,type,dest,index+1)
    if (type.length - 1 == index && node[curType].data==null) node[curType].data = dest;
    Object.keys(node).filter(a=>a!=curType).map(a=>addParToTree(node[a].next,type,'',index+1))
  }
  return node;
}

function buildMultiCaller(pars: ParNode, index = 1) {
  let allKeys = Object.keys(pars.next).sort((a,b)=>a.length-b.length);
  let nextKeys = allKeys.filter(a=>pars.next[a].data!='')
  let hasFalse = allKeys.length!=nextKeys.length
  let s = "";
  if (nextKeys.length > 0) {
    if (nextKeys.length == 1 && pars.data ==null && !hasFalse) {
      s += buildMultiCaller(pars.next[nextKeys[0]], index + 1);
    } else
      for (let i = 0; i < nextKeys.length; i++) {
        if(i>0){
          s+='else '
        }
        if(nextKeys.length-1 != i || nextKeys.length==1) s += `if(${nextKeys[i][0] == '?'?`typeof par${index} == 'undefined' || `:''}typeof par${index} == '${testFunc(pars.next[nextKeys[i]].key)}')`
        s+='{\n\t'+buildMultiCaller(pars.next[nextKeys[i]], index + 1)+'\n}\n'
      }
  }
  if (pars.data != null && pars.data.length>0) {
    let count = 0;
    s+= `return this.TBAGet(\`${pars.data.replace(/{\w+}/g, () => "{par" + ++count +'}')}\`, par${++count})`;
  }else if(nextKeys.length==0){
    s+= `throw new Error('Parameter ${index-1} is of a wrong type')`
  }
  return s;
}
function testFunc(val:string){
  if(/getPromise/.test(val))return 'function'
  return val
}
interface ParNode {
  next: KeyVal<ParNode>;
  data?: string;
  key:string
}

function getEndpointName(key: string) {
  let partial = key.split("/");
  partial.shift();
  let s = "";
  for (let i = 0; i < partial.length; i++) {
    let name = partial[i];
    if (name[0] == "{") continue;
    s += name[0].toUpperCase() + name.slice(1);
  }
  return s;
}

function buildFunctionCaller(data: needPath) {
  return (
    `\n/**
    * ${data.description}\n` +
    data.par.map(par => `* @param ${par.key} ${par.description}\n`).join('') +
    `*/
    ${data.name}(` +
    data.par.map(par => `${par.key}${par.required?'':'?'}: ${par.type}`).join(", ") +
    `):Promise<${data.returnType}>`
  );
}
function buildTypes(defs:KeyVal<IDefinition>){
  let s=''
  for(const key in defs){
    let type = buildType(defs[key],true)
    if(typeof type != 'string'){
      s+=`/** ${type.desc} */\n`
      type = type.val
    }
    s+=`export interface ${key}`+ type+'\n'
  }
  return s
}

function buildType(def:IDefinition):string
function buildType(def:IDefinition,allowDesc:false):string
function buildType(def:IDefinition,allowDesc:boolean):string|{val:string,desc:string}
  function buildType(def:IDefinition,allowDesc=false):string|{val:string,desc:string}{
  let {required,properties} = def
  let s='{\n'
  if(required == null)required=[]
  for(const key in properties){
    let prop = buildProperty(properties[key],allowDesc)
    if(typeof prop != 'string'){
      s+= `/** ${prop.desc} */\n`
      prop = prop.val
    }
    s+=`${key}${required.includes(key)?'':'?'}:${prop}\n`
  }
  s+='}'
  return (allowDesc && def.description != null)?{val:s,desc:def.description}:s
}

function buildProperty(prop:IDefinition | ISchema | Items | IEnum):string
function buildProperty(prop:IDefinition | ISchema | Items | IEnum,allowDesc:false):string
function buildProperty(prop:IDefinition | ISchema | Items | IEnum,allowDesc:boolean):string|{val:string,desc:string}
function buildProperty(prop:IDefinition | ISchema | Items | IEnum,allowDesc=false):string|{val:string,desc:string}{
  if('properties' in prop){
    return buildType(prop,allowDesc)
  }else if('type' in prop){
    if('items' in prop){
      let s = buildProperty(prop.items,allowDesc)
      if(typeof s != 'string'){
        s=s.val
      }
      s+='[]'
      return (allowDesc && prop.description != null)? {val:s,desc:prop.description}:s
    }else if('additionalProperties' in prop){
      let testKeyVal:RegExpExecArray|null,key='key'
      if(prop.description != null && (testKeyVal = KeyValTest.exec(prop.description))!=null){
        key=testKeyVal[1]
      }
        let addProp=buildProperty(prop.additionalProperties,allowDesc),s=''
        if(typeof addProp != 'string'){
          addProp = addProp.val
        }
        s=`{[${key.replace(' ','_')}:string]:${addProp}}`
        return (allowDesc && prop.description != null) ? {val:s,desc:prop.description}:s
    }else if('enum' in prop){
      let s=prop.enum.map(a=>'"'+a+'"').join('|')
      return (allowDesc && prop.description != null)?{val:s,desc:prop.description}:s
    }else{
      let type = fixProp(prop.type)
      if(type == 'array')type='any[]'
      else if(type == 'object')type='{[key:string]:any}'
      return (allowDesc && prop.description != null)? {val:type,desc:prop.description}:type
    }
  }else{
    return fixProp(prop.$ref.split('/').pop())
  }
}

function fixProp(prop:string|undefined){
  if(typeof prop == 'undefined')return ''
  if(prop=='integer')return 'number'
  return prop
}