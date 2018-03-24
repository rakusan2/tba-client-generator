//@ts-ignore
import * as TBAClient from '../client/genAPI'
import * as fs from 'fs'

function fsRead(path:string){
    return new Promise<string>((res,rej)=>{
        fs.readFile(path,'utf8',(err,data)=>{
            if(err)rej(err)
            else res(data.trim())
        })
    })
}

async function main(){
    let tba = new TBAClient.API(await fsRead('test/key.txt'))
    console.log({status:await tba.Status()})
    console.log({team:await tba.Team('frc'+3571)})
    let lisID = tba.TeamEvents('frc3571',2018,(err,data)=>{
        if(err) console.error(err)
        else console.log(data)
    },true)
    global.setTimeout(()=>{
        console.log('Removing Listener')
        tba.removeListener(lisID)
    },100_000)
    tba.Team('',(res)=>{
        res().then()
    })
}

main().catch(console.error)