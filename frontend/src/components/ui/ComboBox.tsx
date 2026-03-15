import '../../css-files/ui/ComboBox.css'

interface ComboBoxProps {
    selectedModel: string;
    onModelChange: (model: string) => void;
}

function ComboBox({ selectedModel, onModelChange }: ComboBoxProps){

    function handleChange(e : React.ChangeEvent<HTMLSelectElement>){
        const selectModel = e.target.value;
        console.log(selectModel);
        onModelChange(selectModel);
        
        try{
            fetch("http://127.0.0.1:8000/model", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({model : selectModel})
            })
            }
            catch(error){
                console.error("Error submitting prompt:", error)
            }
        }

    return(
        <div className='combo-box-container'>
            <select className='model-select' value={selectedModel} onChange={handleChange}>
                <option value="" disabled hidden>
                    Choose a model…
                </option>
                <option value="openai">OpenAi</option>
                <option value="llama3.1:8b">Llama3.1:8b</option>
            </select>
        </div>
    )
}

export default ComboBox;