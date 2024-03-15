import { Editor } from "primereact/editor";
const EditorTxt = ({ seekerTxtIntro, handleEditorChange }) => {
  const header = (
    <span className="ql-formats">
      <button className="ql-bold" aria-label="Bold"></button>
      <button className="ql-underline" aria-label="Underline"></button>
      <button
        className="ql-list"
        value="bullet"
        aria-label="Bullet list"
      ></button>
    </span>
  );

  return (
    <div className="bg-white rounded-md">
      <Editor
        value={seekerTxtIntro}
        onTextChange={handleEditorChange}
        headerTemplate={header}
        style={{ height: "100%" }}
      />
    </div>
  );
};

export default EditorTxt;
