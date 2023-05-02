export const GET = async () => {
    const response = await fetch('http://127.0.0.1:8080/models');
    const data = await response.json();
    return new Response(JSON.stringify(data), {status: 200});
}