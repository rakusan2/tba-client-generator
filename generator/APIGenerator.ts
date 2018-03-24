import * as https from "https";
import * as url from "url";
import * as fs from "fs";

get<SwaggerRoot>("https://www.thebluealliance.com/swagger/api_v3.json")
  .then(data => {
    console.log(data.info.version);
    let paths: KeyVal<PathInfo> = {};
    let pars = data.parameters || {};
    let checks: KeyVal<string> = {};
    for (const key in pars) {
      let c = buildCheck(pars[key], 1);
      if (c != null) checks[key] = c;
    }
    for (const key in data.paths) {
      let path = data.paths[key].get;
      if (path == null) continue;
      let nKey = key.replace(
        /{(\w+)}/g,
        (_, a1) => `\${${typeof checks[a1] != "undefined" ? `check('${a1}',${a1})` : a1}}`
      );
      let returnType = "void";
      if (path.responses != null && path.responses["200"] != null) {
        let responseOK = path.responses["200"];
        if ("$ref" in responseOK) returnType = buildSchemaStr(responseOK);
        else returnType = buildSchemaStr(responseOK.schema);
      }
      paths[nKey] = {
        par:
          path.parameters == null
            ? []
            : path.parameters
                .map(par => {
                  let parKey: string;
                  let parData: Parameter;
                  if ("$ref" in par) {
                    parKey = buildSchemaStr(par);
                    parData = pars[parKey];
                  } else {
                    parKey = par.name;
                    parData = par;
                  }
                  if (parData.in != "path")
                    return { name: "", type: "", description: "", required: false, hasCheck: false };
                  return {
                    name: parKey,
                    type: parData.type || "",
                    description: parData.description || "",
                    required: parData.required || false,
                    hasCheck: typeof checks[parKey] !== "undefined"
                  };
                })
                .filter(a => a.name.length > 0),
        description: path.description || "",
        returnType,
        name: getEndpointName(key)
      };
      addEndpoint(nKey, paths[nKey]);
    }
    let versionStr = new StringBuilder(0).addJSDocLines(`The Blue Alliance V3 API\nVersion ${data.info.version}`).build()
    return {
      host: data.host,
      basePath: data.basePath,
      security: data.securityDefinitions,
      paths,
      types: data.definitions,
      checks,
      note:versionStr
    } as need;
  })
  .then(async data => {
    let file = await fsRead("template.ts");
    file = replace(file, {
      host: '"' + data.host + '"',
      basePath: '"' + data.basePath + '"',
      apiKeyName: '"' + (data.security.apiKey.type == "apiKey" ? data.security.apiKey.name : "") + '"',
      paths: getEndpoints(1),
      types: buildTypeInterfaces(0, data.types),
      checks: Object.keys(data.checks)
        .map(a => a + ": " + data.checks[a])
        .join(",\n"),
      note:data.note
    });
    fs.writeFile("client/genAPI.ts", file, "utf8", err => {
      if (err) throw err;
      console.log("DONE");
    });
  })
  .catch(err => {
    console.error(err);
  });

/**
 * Replace Template variables
 * @param s Input String
 * @param rep Key-Val Object where key is the variable being replaced and val being the replacement
 */
function replace(s: string, rep: KeyVal<string>) {
  return s.replace(
    new RegExp(`\\/\\/(.*){{(\\w+)}}|\\/\\*([^{\\n}]*){{(\\w+)\\*\\/[^{\\n}]*}}([^{\\n}]*)\\*\\/`, "g"),
    (_, a1, a2, a3, a4, a5) => {
      return a3 == null ? a1 + (rep[a2] || "") : a3 + (rep[a4] || "") + a5;
    }
  );
}

/**
 * Build value checks for parameters
 * @param par Swagger Get Path Parameter
 * @param tabs Number of tabs to be shifted by
 */
function buildCheck(par: Parameter, tabs: number) {
  if (par.in != "body") {
    let s = new StringBuilder(tabs + 1).addLine();
    switch (par.type) {
      case "integer":
        s.addLine("val = Math.floor(val)");
      case "number":
        if (par.maximum != null) {
          s.addLine(
            `if(val >${par.exclusiveMaximum ? "=" : ""} ${par.maximum}) throw new Error('${par.name} needs to be <${
              par.exclusiveMaximum ? "" : "="
            } ${par.maximum}')`
          );
        }
        if (par.minimum != null) {
          s.addLine(
            `if(val <${par.exclusiveMinimum ? "=" : ""} ${par.minimum}) throw new Error('${par.name} needs to be >${
              par.exclusiveMinimum ? "" : "="
            } ${par.minimum}')`
          );
        }
        if (par.multipleOf != null) {
          s.addLine(
            `if(val % ${par.multipleOf} != 0) throw new Error('${par.name} needs to be a multiple of ${
              par.multipleOf
            }')`
          );
        }
        break;
      case "string":
        if (par.pattern != null) {
          s.addLine(
            `if(!/${par.pattern.replace(/\\\\/g, "\\")}/.test(val)) throw new Error('${
              par.name
            } needs to satisfy the pattern ${par.pattern}')`
          );
        }
        if (par.maxLength != null) {
          s.addLine(
            `if(val.length > ${par.maxLength}) throw new Error('The length of ${par.name} needs to be <= ${
              par.maxLength
            }')`
          );
        }
        if (par.minLength != null) {
          s.addLine(
            `if(val.length < ${par.minLength}) throw new Error('The length of ${par.name} needs to be >= ${
              par.minLength
            }')`
          );
        }
        break;
    }
    if (s.strings.length > 1) {
      return new StringBuilder(tabs)
        .addLine(`(val:${par.type})=>{`)
        .add(s)
        .addLine("return val")
        .addLine("}")
        .build();
    }
  }
}

let endpoints: KeyVal<functionNeeds> = {};
/**
 * Sort and group Endpoints
 * @param key Endpoint Path
 * @param data Path Info
 */
function addEndpoint(key: string, data: PathInfo) {
  let name = data.name;
  let tags = data.par.map(par => par.name.replace("_", "/"));
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
  let getValuePars = Array.from(data.par)
  let getPromisePars = Array.from(data.par)
  let parsToTree = data.par.map(a => {
    return { type: a.type, req: a.required };
  })
  parsToTree.push({type:'getValue<any> | getPromise<any>',req:true},{type:'boolean',req:true})
  getValuePars.push({
    name:'callback',
    description:'Request Callback',
    type:`getValue<${data.returnType}>`,
    required:true,
    hasCheck:false
  })
  getValuePars.push({
    name:'subscribe',
    description:'Get New Value upon change',
    type:'boolean',
    required:false,
    hasCheck:false
  })
  getPromisePars.push({
    name:'onCashExpire',
    description:'Get new promise once the cash expires',
    type:`getPromise<${data.returnType}>`,
    required:false,
    hasCheck:false
  })
  let getValueCaller:functionCallerInfo={
    name,
    pars:getValuePars,
    description:data.description,
    returnType:'number'
  }
  let getPromiseCaller:functionCallerInfo={
    name,
    pars:getPromisePars,
    description:data.description,
    returnType:`Promise<${data.returnType}>`
  }
  if (typeof endpoints[name] != "undefined") {
    endpoints[name].callerInfo.push(getPromiseCaller, getValueCaller);
    addParToTree(endpoints[name].parBodyTree,parsToTree,key);
  } else
    endpoints[name] = {
      name,
      callerInfo:[getPromiseCaller, getValueCaller],
      parBodyTree: addParToTree({}, parsToTree, key)
    };
}

/**
 * Build All Path function
 * @param tabs Number of Tabs to be shifted by
 */
function getEndpoints(tabs: number) {
  let s = new StringBuilder(tabs);
  for (const key in endpoints) {
    let { callerInfo, parBodyTree } = endpoints[key];
    let typeArr:{types:string[],required:boolean}[] = [];
    let maxIndex=Math.min(...callerInfo.map(a=>a.pars.length))
    callerInfo
    for (let i = 0; i < callerInfo.length; i++) {
      s.addLine();
      buildFunctionCaller(s, callerInfo[i]);
      callerInfo[i].pars.map((par, index) => {
        if (typeof typeArr[index] == "undefined") typeArr[index] = { types: [par.type], required: maxIndex>=index && par.required };
        else {
          if (!typeArr[index].types.includes(par.type)) typeArr[index].types.push(par.type);
          typeArr[index].required = typeArr[index].required && par.required;
        }
      });
    }
    if(callerInfo.length > 2){
      console.log({ multi: key });
    }
    if (callerInfo.length > 0) {
      let req = true;
      s
        .addLine()
        .add(key + "(")
        .add(
          typeArr
            .map(
              (types, i) =>
                `par${i + 1}${(req = req && types.required) ? "" : "?"}: ${[...new Set(types.types)]
                  .sort((a, b) => a.length - b.length)
                  .join(" | ")}`
            )
            .join(", ")
        )
        .add(`): any {`);
      buildMultiCaller(s, { next: parBodyTree, key: "root" });
      s.addLine().addLine("}");
    }
  }
  return s.build();
}

/**
 * Add Parameter to tree
 * @param node Tree root
 * @param type Parameter types
 * @param dest endpoint path
 */
function addParToTree(node: KeyVal<ParNode>, type: { type: string; req: boolean }[], dest: string, index = 0) {
  if (type.length > index) {
    if(typeof node['?'] == 'undefined'){
      node['?']={next:{},key:''}
    }
    const curType = (type[index].req ? "" : "?") + type[index].type;
    if (typeof node[curType] == "undefined"){
      let defaultNode = typeof node['?'] != 'undefined' ? Object.assign({},node['?'].next) : {}
      node[curType] = { next: addParToTree(defaultNode, type, dest, index + 1), key: type[index].type };
    }else addParToTree(node[curType].next, type, dest, index + 1);
    if (type.length - 1 == index && node[curType].data == null) node[curType].data = dest;
    Object.keys(node)
      .filter(a => a != curType)
      .map(a => addParToTree(node[a].next, type, "", index + 1));
  }
  return node;
}

/**
 * Build multi path function body
 * @param builder String builder instance for adding the strings to
 * @param pars Main Parameter Node
 */
function buildMultiCaller(builder: StringBuilder, pars: ParNode, index = 1) {
  let allKeys = Object.keys(pars.next).filter(a=>a!='?').sort((a, b) => a.length - b.length);
  let nextKeys = allKeys.filter(a => pars.next[a].data != "");
  let hasFalse = allKeys.length != nextKeys.length;
  let newTab = builder.getNextTab();
  if (nextKeys.length > 0) {
    if (nextKeys.length == 1 && pars.data == null && !hasFalse) {
      buildMultiCaller(builder, pars.next[nextKeys[0]], index + 1);
    } else {
      newTab.addLine();
      for (let i = 0; i < nextKeys.length; i++) {
        if (i > 0) {
          newTab.add("else ");
        }
        if (nextKeys.length - 1 != i || nextKeys.length == 1)
          newTab.add(
            `if(${
              nextKeys[i][0] == "?" ? `typeof par${index} == 'undefined' || ` : ""
            }typeof par${index} == '${testFunc(pars.next[nextKeys[i]].key)}')`
          );
        newTab.add("{");
        buildMultiCaller(newTab, pars.next[nextKeys[i]], index + 1);
        newTab.addLine().add("}");
      }
    }
  }
  if (pars.data != null && pars.data.length > 0) {
    let count = 0;
    newTab
      .addLine()
      .add(
        `return this.TBAGet(\`${pars.data.replace(
          /{\w+}|{check\('(\w+)',\w+\)}/g,
          (_, a1) => `{${a1 ? `check('${a1}'` : ""}par${++count}${a1 ? ")" : ""}}`
        )}\`, par${++count}, par${++count})`
      );
  } else if (nextKeys.length == 0) {
    newTab.addLine().add(`throw new Error('Parameter ${index - 1} is of a wrong type')`);
  }
  return;
}
/**
 * Replace getPromise with "function"
 * @param val 
 */
function testFunc(val: string) {
  if (/getPromise/.test(val)) return "function";
  return val;
}

/**
 * Get Name of function for a path
 * @param key The Path being given a name
 */
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

/**
 * Build Function caller
 * @param builder String builder instance for adding the strings to
 * @param data Info on the path the caller is being build for
 */
function buildFunctionCaller(builder: StringBuilder, data: functionCallerInfo) {
  builder.addJSDocLines(data.description, data.pars.map(par => par.name + " " + par.description));
  builder
    .add(data.name)
    .add("(")
    .add(data.pars.map(par => `${par.name}${par.required ? "" : "?"}: ${par.type}`).join(", "))
    .add(`):${data.returnType}`);
  return;
}

/**
 * Build All interfaces
 * @param tabs Tab offset for the interfaces
 * @param schemas Key-Val Object with keys being schemas and keys being their names
 */
function buildTypeInterfaces(tabs: number, schemas: KeyVal<Schema>) {
  let s = new StringBuilder(tabs);
  for (const key in schemas) {
    let type = new StringBuilder(tabs);
    let desc = buildSchema(type, schemas[key]);
    if (desc != undefined && desc.length > 0) {
      s.addJSDocLines(desc);
    }
    s
      .add(`export interface ${key}`)
      .add(type)
      .addLine();
  }
  return s.build();
}

/**
 * Build Schema Object
 * @param builder StringBuilder Instance for adding the string to
 * @param schema Schema Object to be built
 */
function buildObject(builder: StringBuilder, schema: SchemaObject): string | undefined {
  let { required, properties } = schema;
  if (properties == null) {
    builder.add("{}");
    return;
  }
  let nextTab = builder.add("{").getNextTab();
  if (required == null) required = [];
  for (const key in properties) {
    nextTab.addLine();
    let prop = new StringBuilder(nextTab.tabs + 1);
    let desc = buildSchema(prop, properties[key]);
    if (desc != undefined && desc.length > 0) {
      nextTab.addJSDocLines(desc);
    }
    nextTab.add(`${key}${required.includes(key) ? "" : "?"}:`).add(prop);
  }
  builder.addLine().add("}");
  return schema.description;
}

/**
 * Build Schema
 * @param prop 
 * @returns Schema type
 */
function buildSchemaStr(prop: Schema | undefined) {
  let s = new StringBuilder();
  buildSchema(s, prop);
  return s.build();
}

/** Extract key name from a Kay-Val Description */
let KeyValTest = /key-val[\w\s`]+ with (?:the )?([\w\s]+) (?:\([\w` ]+\) )?as (?:the )?key/;

/**
 * Build Schema
 * @param builder StringBuilder Instance for adding strings to
 * @param schema The Schema to be built
 * @returns The description in the schema
 */
function buildSchema(builder: StringBuilder, schema: Schema | undefined): string | undefined {
  if (schema == null) {
    builder.add("void");
    return;
  }
  if ("properties" in schema) {
    return buildObject(builder, schema);
  } else if ("type" in schema) {
    if ("items" in schema) {
      buildSchema(builder, schema.items);
      builder.add("[]");
      return schema.description;
    } else if ("additionalProperties" in schema) {
      let testKeyVal: RegExpExecArray | null,
        key = "key";
      if (schema.description != null && (testKeyVal = KeyValTest.exec(schema.description)) != null) {
        key = testKeyVal[1];
      }
      buildSchema(builder, schema.additionalProperties);
      builder.addFirst(`{[${key.replace(" ", "_")}:string]:`).add("}");
      return schema.description;
    } else if ("enum" in schema && schema.enum != null) {
      builder.add(schema.enum.map(a => '"' + a + '"').join(" | "));
      return schema.description;
    } else {
      builder.add(fixProp(schema.type));
      return schema.description;
    }
  } else if ("$ref" in schema) {
    builder.add(fixProp(schema.$ref.split("/").pop()));
    return;
  }
  builder.add("void");
}
/** replace unsupported types */
function fixProp(prop: string | undefined) {
  if (typeof prop == "undefined") return "void";
  if (typeof prop == "string") {
    if (prop == "integer") return "number";
    if (prop == "array") return "any[]";
    if (prop == "object") return "{[key:string]:any}";
  }
  return prop;
}

class StringBuilder {
  tabs: number;
  endStr: string = "\n";
  strings: (string | StringBuilder)[] = [];
  constructor(tabs = 0) {
    this.tabs = tabs;
    for (let i = 0; i < tabs; i++) {
      this.endStr += "  ";
    }
  }
  add(s: string | StringBuilder) {
    this.strings.push(s);
    return this;
  }
  addFirst(s: string) {
    this.strings = [s, ...this.strings];
    return this;
  }
  addLine(s = "") {
    this.strings.push(s + this.endStr);
    return this;
  }
  addJSDocLines(s: string, params: string[] = []) {
    let sl = s.split("\n");
    if (sl.length == 1 && params.length == 0) {
      this.addLine(`/** ${s} */`);
    } else {
      this.addLine("/**");
      for (let i = 0; i < sl.length - 1; i++) {
        this.addLine("* " + sl[i]).addLine("*");
      }
      this.addLine("* " + sl[sl.length - 1]);
      if (params.length > 0) this.addLine("*");
      for (let i = 0; i < params.length; i++) {
        this.addLine("* @param " + params[i]);
      }
      this.addLine("*/");
    }
    return this;
  }
  getNextTab(tab = this.tabs + 1) {
    let sb = new StringBuilder(tab);
    this.strings.push(sb);
    return sb;
  }
  build(): string {
    return this.strings.map(a => (typeof a == "string" ? a : a.build())).join("");
  }
}
/** Promisify fs.readFile */
function fsRead(path: string) {
  return new Promise<string>((res, rej) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) rej(err);
      else res(data);
    });
  });
}
/** Promisified https get */
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
          let data = JSON.parse(obj.replace(/,([\s\n]*})/, (_, a1) => a1));
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

type KeyVal<T> = { [name: string]: T };

interface ParNode {
  next: KeyVal<ParNode>;
  data?: string;
  key: string;
}

interface need {
  host: string;
  basePath: string;
  security: SecurityDefs;
  paths: KeyVal<PathInfo>;
  checks: KeyVal<string>;
  types: KeyVal<Schema>;
  note:string
}

interface PathInfo {
  description: string;
  name: string;
  par: parameterNeed[];
  returnType: string;
}

interface functionNeeds{
  name:string
  parBodyTree:KeyVal<ParNode>
  callerInfo:functionCallerInfo[]
}

interface functionCallerInfo{
  name:string
  pars:parameterNeed[]
  description:string
  returnType:string
}

interface parameterNeed{
  name: string;
  type: string;
  description: string;
  required: boolean;
  hasCheck: boolean;
}