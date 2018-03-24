import * as https from "https";
export type KeyVal<T> = { [key: string]: T };
export type getPromise<T>=(callback: () => Promise<T>)=>any
export type getValue<T> = (error:any,val:T)=>any


const host = /*{{host*/ "www.thebluealliance.com"; /*}}*/
const basePath = /*{{basePath*/ "/api/v3"; /*}}*/
const apiKeyName = /*{{apiKeyName*/ "X-TBA-Auth-Key"; /*}}*/

//{{note}}
export class API {
  private __key: string;
  private cache: KeyVal<{modified:string,val:string,max_age:number}> = {};
  private __listeners:((error:any,val:any)=>any)[]=[]

  constructor(key: string) {
    this.__key = key;
  }

  private __TBAReq(path:string, lastModified:string|undefined, result:(val:string|null,modified:string|undefined,lifetime:number)=>any,reject:(error:any)=>any){
    let opt: https.RequestOptions = {
      protocol: "https:",
      hostname: host,
      path: basePath + path,
      headers: {
        "X-TBA-Auth-Key": this.__key,
        accept: "application/json"
      }
    };
    if (typeof lastModified == "string") opt.headers["If-Modified-Since"] = lastModified;
    https.get(opt, res => {
      res.setEncoding("utf8");
      let raw = "";
      res.on("data", m => {
        raw += m;
      });
      res.on("end", () => {
        let modified = res.headers["last-modified"] || res.headers["Last-Modified"] as string;
        let cacheControl = /max-age=(\d+)/.exec(res.headers["cache-control"] || "");
        let maxAge=0
        if (cacheControl !== null && cacheControl[1] != null) maxAge = 1000 * parseInt(cacheControl[1], 10) + Date.now();
        if (res.statusCode === 304) {
          result(null,modified,maxAge)
        } else if (res.statusCode === 404) reject(JSON.parse(raw));
        else {
          try {
            if (res.statusCode >= 400) return reject(raw);
            result(raw,modified,maxAge);
          } catch (e) {
            reject(e);
          }
        }
      });
      res.on("error", e => {
        reject(e);
      });
    });
  }

  private __TBAGETSub<T=any>(path:string,callback:getValue<T>|number,subscribe?:boolean){
    let id=-1,call:(error:any,val:T)=>any
    if(typeof callback == 'number'){
      if(typeof this.__listeners[callback] == 'function'){
        call = this.__listeners[callback]
        subscribe = true
      }else return
    }else{
      call = callback
      if(subscribe){
        id = this.__listeners.push(callback)-1
      }
    }
    let modified: any, tempCache: string, maxAge: number;
    if (typeof this.cache[path] != "undefined") {
      modified = this.cache[path].modified;
      tempCache = this.cache[path].val;
      maxAge = this.cache[path].max_age;
    }
    if(maxAge > Date.now()){
      if(subscribe)global.setTimeout(()=>this.__TBAGETSub(path,id),maxAge - Date.now())
      try{
        call(null,JSON.parse(tempCache))
      }catch(e){
        call(e,null)
      }
    }else
    this.__TBAReq(path,modified,(val,mod,life)=>{
      if(life>0 && subscribe)global.setTimeout(()=>this.__TBAGETSub(path,id),life - Date.now())
      if(val != null){
        this.cache[path]={val,modified:mod,max_age:life}
        try{
          call(null,JSON.parse(val))
        }catch(e){
          call(e,null)
        }
      }else if(typeof callback == 'function' && !subscribe){
        if(typeof tempCache == 'string'){
          try{
            call(null,JSON.parse(tempCache))
          }catch(e){
            call(e,null)
          }
        }else{
          call(null,null)
        }
      }
    },error => call(error,null))
    if(id>0){
      return id
    }
  }

  private TBAGet<T = any>(path: string, onOutdated?: getPromise<T> | getValue<T>,subscribe?:boolean) {
    if(typeof onOutdated != 'undefined' && onOutdated.length >= 2)return this.__TBAGETSub(path,onOutdated,subscribe)
    let modified: any, tempCache: string, maxAge: number;
    if (typeof this.cache[path] != "undefined") {
      modified = this.cache[path].modified;
      tempCache = this.cache[path].val;
      maxAge = this.cache[path].max_age;
    }
    
    return new Promise<T>((resolve, reject) => {
      if (maxAge != null && maxAge > Date.now()) {
        if (typeof onOutdated == 'function'){
          global.setTimeout(onOutdated, maxAge - Date.now(), () => this.TBAGet(path, onOutdated)).unref();
        }
        resolve(JSON.parse(tempCache));
        return;
      }

      this.__TBAReq(path,modified,(val,newModified,life)=>{
        if(life ==0 && typeof maxAge == 'number' && maxAge>0)life = maxAge
        if(life>0 && typeof onOutdated == 'function'){
          global.setTimeout(onOutdated, maxAge - Date.now(), () => this.TBAGet(path, onOutdated)).unref();
        }
        if(val == null){
          resolve(JSON.parse(tempCache))
        }else{
          this.cache[path] = {modified:newModified,val,max_age:life}
          resolve(JSON.parse(val))
        }
      },reject)

    });
  }

  removeListener(id:number){
    if(id>=0 && id<this.__listeners.length)delete this.__listeners[id]
  }

  //{{paths}}
}

let checks: KeyVal<(<T>(val: T) => T)> = {
  //{{checks}}
};

function check<T>(key: string, val: T): T {
  return checks[key](val);
}

// {{types}}
