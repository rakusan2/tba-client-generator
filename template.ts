import * as https from 'https'
export type KeyVal<T> = { [key: string]: T };
export type getPromise<T> = (callback: () => Promise<T>) => any;

const host= /*{{host*/"www.thebluealliance.com"/*}}*/
const basePath = /*{{basePath*/"/api/v3" /*}}*/
const apiKeyName = /*{{apiKeyName*/"X-TBA-Auth-Key" /*}}*/


export class TBA{
    private __key:string
    private cache:KeyVal<any>={}
    constructor(key:string){
        this.__key=key
    }
    private TBAGet<T=any>(path: string, onOutdated?: getPromise<T>) {
        let modified:any, tempCache: T, maxAge: number;
        if (typeof this.cache[path] != "undefined") {
          modified = this.cache[path].modified;
          tempCache = this.cache[path].val;
          maxAge = this.cache[path].max_age;
        }
        return new Promise<T>((resolve, reject) => {
          if (maxAge != null && maxAge > +new Date()) {
            resolve(tempCache);
            if (onOutdated) global.setTimeout(onOutdated, maxAge - +new Date(), () => this.TBAGet(path, onOutdated)).unref();
            console.log(path + " from cache due to age");
            return;
          }
          let opt: https.RequestOptions = {
            protocol: "https:",
            hostname: host,
            path: basePath + path,
            headers: {
              "X-TBA-Auth-Key": this.__key,
              accept: "application/json"
            }
          };
          if (typeof modified == 'string' && opt.headers!= null) opt.headers["If-Modified-Since"] = modified;
          https.get(opt, res => {
            res.setEncoding("utf8");
            let raw = "";
            res.on("data", m => {
              raw += m;
            });
            res.on("end", () => {
              modified = res.headers["last-modified"] || res.headers["Last-Modified"];
              let cacheControl = /max-age=(\d+)/.exec(res.headers["cache-control"]||'');
              if (cacheControl !== null && cacheControl[1]) maxAge = 1000 * parseInt(cacheControl[1], 10) + +new Date();
              if (onOutdated) global.setTimeout(onOutdated, maxAge - +new Date(), () => this.TBAGet(path, onOutdated)).unref();
              if (res.statusCode === 304) {
                resolve(tempCache);
                console.log(path + " from cache due to 304");
              } else if (res.statusCode === 404) reject(JSON.parse(raw));
              else {
                try {
                  tempCache = JSON.parse(raw);
                  this.cache[path] = { modified, val: tempCache, max_age: maxAge };
                  resolve(tempCache);
                } catch (e) {
                  reject(e);
                }
              }
            });
            res.on("error", e => {
              reject(e);
            });
          });
        });
      }
      //{{paths}}
}

let checks:KeyVal<(<T>(val:T)=>T)> = {/*{{checks*//*}}*/}

function check<T>(key:string,val:T):T{
  return checks[key](val)
}

// {{types}}