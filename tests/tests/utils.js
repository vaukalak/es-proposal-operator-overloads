import { patch } from "operator-overload-rxjs-extension/extension";
import { BehaviorSubject } from "rxjs";
import { map, distinctUntilChanged } from "rxjs/operators";

export const $ = (v) => {
  const subj = new BehaviorSubject(v);
  const observable = patch(subj);
  const setValue = (v) => {
    observable.next(v);
  };
  return [observable, setValue];
};

const appendRawChild = (element, child) => {
  let validChild = child;
  // console.log(">>> validChild:", validChild);
  if (typeof child === "string") {
    validChild = document.createTextNode(child);
  }
  element.appendChild(validChild);
  return validChild;
};

export function createElement(tagName, attrs = {}, ...children) {
  const element =
    typeof tagName === "function"
      ? tagName({ ...attrs, children })
      : document.createElement(tagName, {});
  // console.log(">>> element:", element);
  // for (let i = 0; i < element.children.length; i++) {
  //   element.removeChild(element.children[i]);
  // }
  for (const ch of children) {
    if (ch.subscribe) {
      let lastChild;
      ch.pipe(distinctUntilChanged()).subscribe((v) => {
        if (lastChild) {
          element.removeChild(lastChild);
        }
        lastChild = appendRawChild(element, v);
      });
    } else {
      appendRawChild(element, ch);
    }
  }
  if (attrs) {
    Object.keys(attrs).forEach((key) => {
      const attrValue = attrs[key];
      if (attrValue.subscribe) {
        attrValue.pipe(distinctUntilChanged()).subscribe((v) => {
          element[key] = v;
        });
      } else {
        if (key === "onInput") {
          element.addEventListener("input", (e) => {
            // attrValue.next(parseInt(e.target.value, 10) || 0);
            // attrValue.next(e.target.value);
            attrValue(e.target.value);
          });
        } else {
          element[key] = attrValue;
        }
      }
    });
  }
  return element;
}
