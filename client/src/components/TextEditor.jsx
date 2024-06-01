import ReactQuill from "react-quill";
export default function TextEditor({value, onChange}) {

    const modules = {
        toolbar: [
            [{ 'header': '1'}, { 'header': '2'}, { 'font': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }, { 'align': [] }],
            [{ 'direction': 'rtl' }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'image', 'video'],
            ['clean']
        ]
    };
    
    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video', 'color', 'background', 'align', 'direction', 'script',
        'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact'
    ];


    return (
    <ReactQuill 
        value={value} 
        modules={modules} 
        formats={formats}
        onChange={onChange}/>
    )
}