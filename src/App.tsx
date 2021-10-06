import { useEffect, useState } from "react";
import "./App.css";

interface Todo {
  value: string;
  id: number;
  checked: boolean;
  removed: boolean;
}

type Filter = "all" | "checked" | "unchecked" | "removed";

const App = () => {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [lang, setLang] = useState(true);

  // 現在のfilterステートの値によってTodoのうち表示するものを決める（filter関数によって振り分け、「filterdTodos」に返している）
  // onChangeなど何かしらイベントが発火するとここを通り、再振り分けがされる
  const filterdTodos = todos.filter((todo) => {
    switch (filter) {
      case "all":
        return !todo.removed;
      // removeがfalse以外 つまり削除されていないものすべて（すべてのタスク）
      case "checked":
        return todo.checked && !todo.removed;
      // checkがtrueかつremovedがfalse そのうちチェックが付いているもの（完了済みのタスク）
      case "unchecked":
        return !todo.checked && !todo.removed;
      // checkがfalseかつremovedがfalse そのうちチェックが付いていないもの（現在のタスク）
      case "removed":
        return todo.removed;
      // 削除されたもの（ごみ箱）
      default:
        return todo;
      // すべて含める
    }
  });

  const translatedFilter = (arg: Filter) => {
    switch (arg) {
      case "all":
        return lang ? "すべてのタスク" : "All Tasks";
      case "checked":
        return lang ? "完了済み" : "Completed";
      case "unchecked":
        return lang ? "現在のタスク": "Incompleted";
      case "removed":
        return lang ? "ゴミ箱": "Dust";
      default:
        return "TODO";
    }
  };

  useEffect(() => {
    document.title = translatedFilter(filter);
  }, [filter]);

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement | HTMLInputElement>
  ) => {
    e.preventDefault();
    if (!text) return;

    const newTodo: Todo = {
      value: text,
      id: new Date().getTime(),
      checked: false,
      removed: false,
    };
    setTodos([...todos, newTodo]);
    setText("");
  };

  const handleEdit = (id: number, value: string) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.value = value;
      }
      return todo;
    });
    setTodos(newTodos);
  };

  const handleCheck = (id: number, checked: boolean) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.checked = !checked;
      }
      return todo;
    });
    setTodos(newTodos);
  };

  const handleRemove = (id: number, removed: boolean) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.removed = !removed;
      }
      return todo;
    });
    setTodos(newTodos);
  };

  const handleEmpty = () => {
    const newTodos = todos.filter((todo) => {
      return !todo.removed;
    });
    setTodos(newTodos);
  };

  const changeLang = () => {
    setLang(!lang);
  };

  return (
    <div className="App">
      <div>
        <button onClick={() => changeLang()}>{lang ? "English" : "日本語"}</button>
      </div>
      {/* select内の値が変わったとき「filter」stateをoptionのvalueに変える   */}
      <select
        defaultValue="all"
        onChange={(e) => setFilter(e.target.value as Filter)}
      >
        <option value="all">{translatedFilter("all")}</option>
        <option value="unchecked">{translatedFilter("unchecked")}</option>
        <option value="checked">{translatedFilter("checked")}</option>
        <option value="removed">{translatedFilter("removed")}</option>
      </select>

      {filter === "removed" ? (
        // <button disabled={filterdTodos.filter((todo) => todo.removed).length === 0} onClick={() => handleEmpty()}>
        <button
          disabled={filterdTodos.length === 0}
          onClick={() => handleEmpty()}
        >
          ゴミ箱を空にする
        </button>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={text}
            disabled={filter === "checked"}
            onChange={(e) => setText(e.target.value)}
          />
          <input type="submit" value="送信" disabled={filter === "checked"} />
          {/* <input type="submit" value="送信" onSubmit={handleSubmit} /> */}
        </form>
      )}

      <ul>
        {filterdTodos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              disabled={todo.removed}
              checked={todo.checked}
              onChange={(e) => handleCheck(todo.id, todo.checked)}
            />
            <input
              type="text"
              value={todo.value}
              disabled={todo.checked || todo.removed}
              onChange={(e) => handleEdit(todo.id, e.target.value)}
            />
            <button onClick={() => handleRemove(todo.id, todo.removed)}>
              {todo.removed ? "復元" : "削除"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
