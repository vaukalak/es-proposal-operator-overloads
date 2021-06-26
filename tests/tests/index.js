"use overload";
import { map, tap } from "rxjs/operators";
import { patch } from "operator-overload-rxjs-extension/extension";
import { createElement, $ } from "./utils";

// rovar component

const FormElement = ({ field }) => {
  const error = patch(
    field.value
      // .pipe(tap((v) => console.log(">>> v:", v)))
      .pipe(map((v) => v.length === 0))
  );
  const styles = {
    container: `
      background-color: ${error ? "red" : "yellow"};
      padding: 10px;
    `
  };

  return (
    <div style={styles.container}>
      <div>{field.name}</div>
      <input value={field.value} onInput={field.setValue} />
      {error ? <div style="font-weight: bold;">NOT GOOD</div> : ""}
    </div>
  );
};

const [firstNameValue, setFristNameValue] = $("Mihas");

const firstName = {
  name: "First Name",
  value: firstNameValue,
  setValue: setFristNameValue
};

const [nickNameValue, setNickNameValue] = $("Vaukalak");

const nickName = {
  name: "Nick Name",
  value: nickNameValue,
  setValue: setNickNameValue
};

document.getElementById("app").appendChild(
  <div>
    <FormElement field={firstName} />
    <FormElement field={firstName} />
    <FormElement field={firstName} />
    <FormElement field={firstName} />
    <FormElement field={firstName} />
    <FormElement field={firstName} />
    <FormElement field={nickName} />
  </div>
);
