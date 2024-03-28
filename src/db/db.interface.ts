export interface IDatabaseConfigAttributes {
  username?: string;
  password?: string;
  database?: any;
  host?: string;
  port?: any;
  dialect?: any;
  urlDatabase?: string;
  logging?: true;
}

export interface IDatabaseConfig {
  dev: IDatabaseConfigAttributes;
}
