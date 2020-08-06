import {IToDo} from "~/app/interfaces/todo.interface";

export class TodoMapper {

    transformFromText(text: string): IToDo {
        return this.transform(null, text, 0);
    }

    transform(id, name, done): IToDo {
        return <IToDo>{
            id: id,
            name: name,
            done: done === 1
        };
    }

    transformAll(rows: any[]): IToDo[] {
        if (!rows) {
            return [];
        }

        const toDos: IToDo[] = [];
        for (let row in rows) {
            const toDo = this.transform(rows[row][0], rows[row][1], rows[row][2]);
            toDos.push(toDo);
        }

        return toDos;
    }

}
