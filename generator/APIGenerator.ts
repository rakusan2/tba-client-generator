import * as https from "https";
import * as url from "url";
import * as fs from "fs";

type KeyVal<T> = {[name:string]:T}

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
        let data = JSON.parse(obj.replace(/,([\s\n]*})/,(_,a1)=>a1));
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

get<SwaggerRoot>("https://www.thebluealliance.com/swagger/api_v3.json")
  .then(data => {
    console.log(data.info.version)
    let paths: KeyVal<needPath> = {};
    let pars = data.parameters||{};
    let checks:KeyVal<string>={}
    for (const key in pars) {
      let c = buildCheck(pars[key])
      if(c!= null)checks[key]=c
    }
    for (const key in data.paths) {
      let path = data.paths[key].get;
      if(path == null)continue
      let nKey= key.replace(/{(\w+)}/g,(_,a1)=>`\${${(typeof checks[a1]!='undefined')?`check('${a1}',${a1})`:a1}}`)
      let returnType='void'
      if(path.responses != null && path.responses['200'] != null){
        let responseOK = path.responses['200']
        if('$ref' in responseOK)returnType = buildSchema(responseOK)
        else returnType = buildSchema(responseOK.schema)
      }
      paths[nKey] = {
        par: (path.parameters == null)?[]: path.parameters.map(par => {
          let parKey:string
          let parData:Parameter
          if('$ref' in par){
            parKey = buildSchema(par)
            parData = pars[parKey]
          }else{
            parKey = par.name
            parData = par
          }
          if(parData.in!='path')return {key:'',type:'',description:'',required:false,hasCheck:false}
            return {
              key: parKey,
              type: (parData.type) || '',
              description: parData.description || '',
              required:parData.required || false,
              hasCheck:typeof checks[parKey] !== 'undefined'
            };
          }).filter(a=>a.key.length>0),
        description: path.description || '',
        returnType,
        name: getEndpointName(key)
      };
      addEndpoint(nKey, paths[nKey]);
    }
    return {
      host: data.host,
      basePath: data.basePath,
      security: data.securityDefinitions,
      paths,
      types: data.definitions,
      checks
    } as need;
  })
  .then(async data => {
    let file = await fsRead("template.ts");
    file = replace(file, {
      host: '"'+data.host+'"',
      basePath: '"'+data.basePath+'"',
      apiKeyName: '"'+(data.security.apiKey.type=='apiKey'? data.security.apiKey.name:'')+'"',
      paths: getEndpoints(),
      types: buildTypes(data.types),
      checks:Object.keys(data.checks).map(a=>a+': '+data.checks[a]).join(',\n')
    });
    fs.writeFile('client/genAPI.ts',file,'utf8',err=>{if(err)throw err;console.log('DONE')})
  }).catch(err=>{
    console.error(err)
  })


function replace(s: string, rep: KeyVal<string>) {
  return s.replace(new RegExp(`\\/\\/(.*){{(\\w+)}}|\\/\\*([^{\\n}]*){{(\\w+)\\*\\/[^{\\n}]*}}([^{\\n}]*)\\*\\/`, "g"), (_, a1, a2,a3,a4,a5) => {
    return a3==null?a1 + (rep[a2]||''):a3+(rep[a4]||'')+a5;
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

function buildCheck(par:Parameter){
  if(par.in!='body'){
    let s=''
    switch(par.type){
      case "integer":
      s = 'val = Math.floor(val)'
      case "number":
      if(par.maximum!=null){
        s+=`\nif(val >${par.exclusiveMaximum?'=':''} ${par.maximum}) throw new Error('${par.name} needs to be <${par.exclusiveMaximum?'':'='} ${par.maximum}')`
      }
      if(par.minimum != null){
        s+=`\nif(val <${par.exclusiveMinimum?'=':''} ${par.minimum}) throw new Error('${par.name} needs to be >${par.exclusiveMinimum?'':'='} ${par.minimum}')`
      }
      if(par.multipleOf != null){
        s+=`\nif(val % ${par.multipleOf} != 0) throw new Error('${par.name} needs to be a multiple of ${par.multipleOf}')`
      }
      break
      case "string":
      if(par.pattern != null){
        s+=`\nif(!/${par.pattern.replace(/\\\\/g,'\\')}/.test(val)) throw new Error('${par.name} needs to satisfy the pattern ${par.pattern}')`
      }
      if(par.maxLength != null){
        s+=`\nif(val.length > ${par.maxLength}) throw new Error('The length of ${par.name} needs to be <= ${par.maxLength}')`
      }
      if(par.minLength != null){
        s+=`\nif(val.length < ${par.minLength}) throw new Error('The length of ${par.name} needs to be >= ${par.minLength}')`
      }
      break
    }
    if(s.length>0)return `(val:${par.type})=>{${s}\nreturn val\n}`
  }
}

interface need {
  host: string;
  basePath: string;
  security: SecurityDefs;
  paths: KeyVal<needPath>;
  checks:KeyVal<string>
  types: KeyVal<Schema>;
}
interface needPath {
  description: string;
  name: string;
  par: {
    key: string;
    type: string;
    description: string;
    required:boolean
    hasCheck:boolean
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
  data.par.push({key:'onCashExpire',type:`getPromise<${data.returnType}>`,description:'Get new promise once the cash expires',required:false,hasCheck:false})
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

function addParToTree(node: KeyVal<ParNode>, type: {type:string,req:boolean}[], dest: string, index = 0) {
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
    s+= `return this.TBAGet(\`${pars.data.replace(/{\w+}|{count\('(\w+)',\w+\)}/g, (_,a1) => `{${a1?`count('${a1}'`:''}"par"${++count}${a1?')':''}}`)}\`, par${++count})`;
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
function buildTypes(defs:KeyVal<Schema>){
  let s=''
  for(const key in defs){
    let type = buildSchema(defs[key],true)
    if(typeof type != 'string'){
      s+=`/** ${type.desc} */\n`
      type = type.val
    }
    s+=`export interface ${key}`+ type+'\n'
  }
  return s
}

function buildObject(def:SchemaObject):string
function buildObject(def:SchemaObject,allowDesc:false):string
function buildObject(def:SchemaObject,allowDesc:boolean):string|{val:string,desc:string}
  function buildObject(def:SchemaObject,allowDesc=false):string|{val:string,desc:string}{
  let {required,properties} = def
  if(properties == null)return '{}'
  let s='{\n'
  if(required == null)required=[]
  for(const key in properties){
    let prop = buildSchema(properties[key],allowDesc)
    if(typeof prop != 'string'){
      s+= `/** ${prop.desc} */\n`
      prop = prop.val
    }
    s+=`${key}${required.includes(key)?'':'?'}:${prop}\n`
  }
  s+='}'
  return (allowDesc && def.description != null)?{val:s,desc:def.description}:s
}

function buildSchema(prop:Schema| undefined):string
function buildSchema(prop:Schema| undefined,allowDesc:false):string
function buildSchema(prop:Schema| undefined,allowDesc:boolean):string|{val:string,desc:string}
function buildSchema(prop:Schema| undefined,allowDesc=false):string|{val:string,desc:string}{
  if(prop == null) return 'void'
  if('properties' in prop){
    return buildObject(prop,allowDesc)
  }else if('type' in prop){
    if('items' in prop){
      let s = buildSchema(prop.items,allowDesc)
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
        let addProp=buildSchema(prop.additionalProperties,allowDesc),s=''
        if(typeof addProp != 'string'){
          addProp = addProp.val
        }
        s=`{[${key.replace(' ','_')}:string]:${addProp}}`
        return (allowDesc && prop.description != null) ? {val:s,desc:prop.description}:s
    }else if('enum' in prop && prop.enum != null){
      let s=prop.enum.map(a=>'"'+a+'"').join('|')
      return (allowDesc && prop.description != null)?{val:s,desc:prop.description}:s
    }else{
      let type = fixProp(prop.type) as string
      if(type == 'array')type='any[]'
      else if(type == 'object')type='{[key:string]:any}'
      return (allowDesc && prop.description != null)? {val:type || '',desc:prop.description}:type||''
    }
  }else if('$ref' in prop){
    return fixProp(prop.$ref.split('/').pop()) || 'void'
  }
  return 'void'
}

function fixProp<T>(prop:T):T{
  if(typeof prop == 'undefined')return <any>''
  if(typeof prop == 'string' && prop=='integer')return <any>'number'
  return prop
}