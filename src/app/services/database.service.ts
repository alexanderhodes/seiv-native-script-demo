import {Injectable} from "@angular/core";
import {IToDo} from "~/app/interfaces";
import {Observable, ReplaySubject} from "rxjs";
import {TodoMapper} from "~/app/mappers";
const Sqlite = require('nativescript-sqlite');

const createToDoTableStatement: string
    = 'CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, done INTEGER)';
const insertToDoStatement: string = 'INSERT INTO todos (name, done) VALUES (?, ?)';
const selectAllToDosStatement: string = 'SELECT * FROM todos';
const deleteAllToDosStatement: string = 'DELETE FROM todos';
const updateToDoStatement: string = 'UPDATE todos SET name = ?, done = ? WHERE id = ?';

@Injectable({ providedIn: "root" })
export class DatabaseService {

    private _database: any;
    private _databaseName: string = 'todos.db';

    constructor(private todoMapper: TodoMapper) {
        (new Sqlite(this._databaseName)).then(db => {
            db.execSQL(createToDoTableStatement).then(() => {

                this._database = db;
            }, error => {
                console.log('error creating table todo', error);
            })
        }, error => {
            console.log('open db error', error);
        })
    }

    insertToDo(toDo: IToDo): Observable<boolean> {
        const subject$ = new ReplaySubject<boolean>();

        this._database.execSQL(insertToDoStatement, [toDo.name, 0]).then(id => {
            console.log('success inserted', toDo.name, id);
            subject$.next(true);
            subject$.complete();
        }, error => {
            console.log('error inserting todo with name', toDo.name, error);
            subject$.next(false);
            subject$.complete();
        });

        return subject$.asObservable();
    }

    getAllToDos(): Observable<IToDo[]> {
        const subject$ = new ReplaySubject<IToDo[]>();

        this._database.all(selectAllToDosStatement).then((rows: any[]) => {
            const toDos = this.todoMapper.transformAll(rows);
            subject$.next(toDos);
            subject$.complete();
        }, error => {
            console.log('error querying todos', error);
            subject$.error(error);
            subject$.complete();
        });

        return subject$.asObservable();
    }

    deleteAllToDos(): Observable<boolean> {
        const subject$ = new ReplaySubject<boolean>();

        this._database.execSQL(deleteAllToDosStatement).then(res => {
            console.log('success delete all todos', res);
            subject$.next(true);
            subject$.complete();
        }, error => {
            console.log('error deleting all todos', error);
            subject$.next(false);
            subject$.complete();
        });

        return subject$.asObservable();
    }

    updateToDo(toDo: IToDo): Observable<boolean> {
        const subject$ = new ReplaySubject<boolean>();

        this._database.execSQL(updateToDoStatement, [toDo.name, toDo.done ? 0 : 1, toDo.id]).then(id => {
            console.log('success updated', toDo.name, id);
            subject$.next(true);
            subject$.complete();
        }, error => {
            console.log('error updating todo with name', toDo.name, error);
            subject$.next(false);
            subject$.complete();
        });

        return subject$.asObservable();
    }

}
