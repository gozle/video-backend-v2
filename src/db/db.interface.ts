export interface IDatabaseConfigAttributes {
    username?: string;
    password?: string;
    database?: any;
    host?: string;
    port?:  any;
    dialect?: any;
    urlDatabase?: string;
}

export interface IDatabaseConfig {
    dev: IDatabaseConfigAttributes;
  
}