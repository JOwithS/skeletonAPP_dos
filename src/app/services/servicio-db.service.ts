import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ServicioDBService {
  public database: SQLiteObject | undefined;
  private _storage: Storage | null = null;
  private authToken: string | null = null; 
  
  constructor(private sqlite: SQLite, private storage: Storage) {
    this.initializeDatabase().then(() => {
      this.initStorage().then(() => {
        this.loadToken();
      });
    });
  }

 
//función que setea un objeto SQLiteObject
  async initializeDatabase() {
    try {
      const db = await this.sqlite.create({
        name: 'data.db',
        location: 'default'
      });
      this.database = db;
      await this.createTables();
      console.log('Base de datos inicializada.');
    } catch (e) {
      console.error('Error al crear la base de datos', e);
    }
  }
//función que genere las tablas 
  private async createTables() {
    if (!this.database) {
      throw new Error('Base de datos no inicializada.');
    }

    const sql = `
      CREATE TABLE IF NOT EXISTS sesion_data (
        user_name TEXT PRIMARY KEY NOT NULL,
        password TEXT NOT NULL,
        active INTEGER NOT NULL
      );
    `;

    try {
      await this.database.executeSql(sql, []);
      console.log('Tabla creada correctamente.');
    } catch (e) {
      console.error('Error al crear la tabla', e);
    }
  }

   // Método para inicializar el almacenamiento
   async initStorage() {
    const storage = await this.storage.create();
    this._storage = storage;
  }
  // Método para cargar el token desde el almacenamiento
 private async loadToken() {
  this.authToken = await this._storage?.get('auth_token') || null;
}

// Método para verificar si el usuario tiene acceso (autenticado)
async haveaccess(): Promise<boolean> {
  await this.loadToken();
  return this.authToken !== null;
}



//función que consulta si existe alguna sesión activa
  async checkActiveSession(): Promise<boolean> {
    if (!this.database) {
      throw new Error('Base de datos no inicializada.');
    }

    const sql = 'SELECT * FROM sesion_data WHERE active = 1';
    try {
      const res = await this.database.executeSql(sql, []);
      if (res.rows.length > 0) {
        await this._storage?.set('currentUser', res.rows.item(0).user_name);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error al verificar la sesión activa', e);
      return false;
    }
  }
//función que valida la existencia de un usuario que inicia sesión
  async validateUser(username: string, password: string): Promise<boolean> {
    if (!this.database) {
      throw new Error('Base de datos no inicializada.');
    }

    const sql = 'SELECT * FROM sesion_data WHERE user_name = ? AND password = ?';
    try {
      const res = await this.database.executeSql(sql, [username, password]);
      return res.rows.length > 0;
    } catch (e) {
      console.error('Error al validar el usuario', e);
      return false;
    }
  }
//función que permite  el registro de una sesión
  async registerSession(username: string, password: string): Promise<void> {
    if (!this.database) {
      throw new Error('Base de datos no inicializada.');
    }

    const sql = 'INSERT INTO sesion_data (user_name, password, active) VALUES (?, ?, 1)';
    try {
      await this.database.executeSql(sql, [username, password]);
      await this._storage?.set('currentUser', username);
      console.log('Sesión registrada y activada.');
    } catch (e) {
      console.error('Error al registrar la sesión', e);
    }
  }

  //función que permite  la actualización de una sesión
  async updateSessionState(username: string, isActive: boolean): Promise<void> {
    if (!this.database) {
      throw new Error('Base de datos no inicializada.');
    }

    const sql = 'UPDATE sesion_data SET active = ? WHERE user_name = ?';
    try {
      await this.database.executeSql(sql, [isActive ? 1 : 0, username]);
      if (isActive) {
        await this._storage?.set('currentUser', username);
      } else {
        await this._storage?.remove('currentUser');
      }
      console.log('Estado de sesión actualizado.');
    } catch (e) {
      console.error('Error al actualizar el estado de la sesión', e);
    }
  }
  async getCurrentUser(): Promise<string | null> {
    if (!this.database) {
      throw new Error('Base de datos no inicializada.');
    }
  
    const sql = 'SELECT user_name FROM sesion_data WHERE active = 1';
    try {
      const res = await this.database.executeSql(sql, []);
      if (res.rows.length > 0) {
        return res.rows.item(0).user_name;
      } else {
        return null;
      }
    } catch (e) {
      console.error('Error al obtener el usuario actual', e);
      return null;
    }
  }
/////////////////*Almacena aquí temporalmente el token en una variable local*////////////////////////


// Método para iniciar sesión y almacenar el token
  async login(token: string) {
    await this._storage?.set('auth_token', token);
    this.authToken = token;  
  }
  // Método para cerrar sesión y limpiar el token
  async logout() {
    const currentUser = await this._storage?.get('currentUser');
    if (currentUser) {
      await this.updateSessionState(currentUser, false);
    }
    await this._storage?.remove('auth_token');
    this.authToken = null;  // Limpiar la variable local
  }
// Si el token está almacenado en la variable local, el usuario está autenticado//
  async isAuthenticated(): Promise<boolean> {
    if (this.authToken) {
      return true;  
    }
// Almacenar temporalmente el token en la variable local dentro del storage//
    const token = await this._storage?.get('auth_token');
    const isLoggedIn = !!token;
    if (isLoggedIn) {
      this.authToken = token;  
    }
    console.log(`Usuario autenticado: ${isLoggedIn}`);
    return isLoggedIn;
  }
}
