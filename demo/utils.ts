export function bindCallback(id: string, func: any) {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("click", func);
  }
}

export function display(data: any, id: number) {
  const str = JSON.stringify(data);
  const display = document.querySelector("#display" + id);
  if (display) {
    display.innerHTML = str;
  }
}

export function getContentById(id: string) {
  const el = document.getElementById(id) as HTMLInputElement;
  return el?.value ?? "";
}
