async function apiFetch(endpoint,options){
    const baseUrl = "http://localhost:3000/api";
    const token = localStorage.getItem('token');
    const header = {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}` 
        }
    const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

    try{
        const response = await fetch(url,Headers,options);
        if(!response.ok){
            throw new Error('Response status: ${response.status}');
        }
        return await response.json();
    }
    catch(error){
        console.error(error.message);
    }
}