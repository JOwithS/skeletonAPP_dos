import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ServicioDBService {
  public database: SQLiteObject | undefined;
  private _storage: Storage | null = null;

  constructor(private sqlite: SQLite, private storage: Storage) {
    this.initializeDatabase();
    this.initStorage();
  }

  async initStorage() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

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
}
