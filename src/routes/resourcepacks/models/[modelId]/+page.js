export const load = ({fetch, params}) => {
    
    const fetchModel = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/models/${id}`);
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error(error);
        }
    }

    return {
        model: fetchModel(params.modelId)
    }
}