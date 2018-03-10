interface SwaggerRoot{
    swagger:string
    info:Info
    host?:string
    basePath?:string
    schemes?:string[]
    consumes?:string[]
    produces:string[]
    paths:Paths
    definitions?:Definitions
    parameters?:Parameters
    responses?:ResponsesDef
    securityDefinitions?:SecurityDefs
    security?: SecurityReq[]
    tags?:Tag[]
    externalDocs?:ExternalDoc
}
interface Info{
    title:string
    description?:string
    termsOfService?:string
    contact?:Contact
    license?:License
    version:string
}
interface Contact{
    name?:string
    url?:string
    email?:string
}
interface License{
    name?:string
    url?:string
}
interface Paths{
    [path:string]:Path
}
interface Path{
    $ref?:string
    get?:Operation
    put?:Operation
    post?:Operation
    delete?:Operation
    options?:Operation
    head?:Operation
    patch?:Operation
    parameters?:(Parameter|Reference)[]
}
interface Operation{
    tags?:string[]
    summary?:string
    description?:string
    externalDocs?:ExternalDoc
    operationId?:string
    consumes?:string[]
    produces?:string[]
    parameters?:(Parameter|Reference)[]
    responses?:Responses
    schemes?:string[]
    deprecated?:boolean
    security?:SecurityReq
}
interface ExternalDoc{
    description?:string
    url?:string
}
interface ParameterBase{
    name:string
    description?:string
    required?:boolean
}
interface ParameterBody extends ParameterBase{
    in:'body'
    schema:Schema
}
interface ParameterPath extends ParameterExtension{
    in:"path"
    required:boolean
}
interface ParameterOther extends ParameterExtension{
    in:"query"| "header"| "formData"
}
interface ParameterExtension extends ParameterBase,JSONObjectBase{
    type?:"string"| "number"| "integer"| "boolean"| "array" | "file"
    format?:string
    allowEmptyValue?:boolean
    items?:Item
    collectionFormat?:string
    default:any
}
interface JSONObjectBase{
    maximum?:number
    minimum?:number
    exclusiveMaximum?:boolean
    exclusiveMinimum?:boolean
    maxLength?:number
    minLength?:number
    pattern?:string
    maxItems?:number
    minItems?:number
    uniqueItems?:boolean
    enum?:any[]
    multipleOf?:number
}
type Parameter = ParameterBody | ParameterPath | ParameterOther

interface Item extends JSONObjectBase{
    type:"string"|"number"| "integer"|"boolean"|"array"
    format?:string
    items?:Item
    collectionFormat?:'csv'|'ssv'|'tsv'|'pipes'
    default?:any
}
interface Responses{
    [status_code:string]:(IResponse|Reference)
}
interface IResponse{
    description:string
    schema?:Schema
    headers?:IHeaders
    examples?:Example
}
interface IHeaders{
    [name:string]:Header
}
interface Example{
    [mine_type:string]:any
}
interface Header extends Item{
    description?:string
}
interface Tag{
    name:string
    description?:string
    externalDocs?:ExternalDoc
}
interface Reference{
    $ref:string
}
type Schema = SchemaInstance | SchemaArray | SchemaNumber | SchemaObject | SchemaString|Reference
type SchemaType ="null"| "boolean"| "object"| "array"| "number"| "string"|"integer"
interface SchemaInstance{
    type?: SchemaType
    enum?:any[]
    title?:string
    description?:string
    format?:string
    default?:any
}
interface SchemaNumber extends SchemaInstance{
    type:'number'|"integer"
    multipleOf?:number
    maximum?:number
    minimum?:number
    exclusiveMaximum?:boolean
    exclusiveMinimum?:boolean
}
interface SchemaString extends SchemaInstance{
    type:'string'
    maxLength?:number
    minLength?:number
    pattern?:string
}
interface SchemaArray extends SchemaInstance{
    type:'array'
    maxItems?:number
    minItems?:number
    uniqueItems?:boolean
    items?:Schema
}
interface SchemaObject extends SchemaInstance{
    type:"object"
    maxProperties?:number
    minProperties?:number
    required?:string[]
    properties?:{[key:string]:Schema}
    additionalProperties?:Schema
}
interface Definitions{
    [name:string]:Schema
}
interface Parameters{
    [name:string]:Parameter
}
interface ResponsesDef{
    [name:string]:IResponse
}
interface SecurityDefs{
    [name:string]:Security
}

interface SecurityAll{
    type:"basic"| "apiKey"| "oauth2" 
    description?:string
}
interface SecurityApiKey extends SecurityAll{
    type:"apiKey"
    name:string
    in:"query" |"header"
}
interface SecurityOAuthAll extends SecurityAll{
    type:"oauth2"
    scopes:Scopes
}
interface SecurityOauthImplicit extends SecurityOAuthAll{
    flow:"implicit"| "accessCode"
    authorizationUrl:string
}
interface SecurityOauthPassword extends SecurityOAuthAll{
    flow:"password"| "application" | "accessCode"
    tokenUrl:string
}
type Security = SecurityApiKey | SecurityOauthImplicit | SecurityOauthPassword
interface Scopes{
    [name:string]:string
}
interface SecurityReq{
    [name:string]:string[]
}