import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {IToDo} from "~/app/interfaces";
import {DatabaseService} from "~/app/services/database.service";
import {TodoMapper} from "~/app/mappers";

@Injectable({
    providedIn: "root"
})
export class TodoService {

    constructor(private databaseService: DatabaseService,
                private todoMapper: TodoMapper) {}

    getToDos$(): Observable<IToDo[]> {
        return this.databaseService.getAllToDos();
    }

    addTodo(text: string): Observable<boolean> {
        const todo = this.todoMapper.transformFromText(text);

        return this.databaseService.insertToDo(todo);
    }

    toggleDone(todo: IToDo): Observable<boolean> {
        return this.databaseService.updateToDo(todo);
    }

}
