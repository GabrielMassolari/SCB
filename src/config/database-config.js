
// Configuração do banco de dados no ambiente de teste
/*
export const databaseConfig = {
  dialect: 'sqlite',
  storage: 'database.sqlite',
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  }
};
*/

/*
// Configuração do banco de dados no ambiente de desenvolvimento
export const databaseConfig = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'postgres',
  database: 'scv-backend-node-sequelize',
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  }
};
*/

// Configuração do banco de dados no ambiente de produção
export const databaseConfig = {
  dialect: 'postgres',
  host: 'dpg-ciad3015rnupq1vk2bvg-a.oregon-postgres.render.com',
  username: 'scb_backend_node_user',
  password: 'nwgm5tswfd0Lr0ADcM3qZoIxU0h26838',
  database: 'scb_backend_node',
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  },
  dialectOptions: {
    ssl: true
  }
};
