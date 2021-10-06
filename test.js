// 多分実際はグローバルオブジェクトではない

const func2 = (e) => {
  console.log(e.age);
};

const func1 = () => {
  func2(e);
};

{
  const e = {
    name: "kawa",
    age: 31,
    greet() {
      console.log("hello");
    },
  };
  func1();
}
// 勝手に引数「e」（メソッド）が入ってくる的な
