type ImageModalProps = {
  img: string;
}

export function ImageModal(props: ImageModalProps) {
  const el = document.createElement("div");
  el.style.position = "absolute";
  el.style.top = "0";
  el.style.bottom = "0";
  el.style.left = "0";
  el.style.right = "0";
  el.style.textAlign = "center";
  el.style.backgroundColor = "rgba(0,0,0, 0.95)";
  el.addEventListener("click", () => {
    el.remove();
  })

  const img = document.createElement("img");
  img.style.width = "auto";
  img.style.height = "100%"
  img.src = props.img;
  el.appendChild(img);

  return el;
}