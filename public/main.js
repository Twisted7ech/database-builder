document.querySelector('#updateButton').addEventListener('click', updateEntry)
document.querySelector('#deleteButton').addEventListener('click', deleteEntry)


async function updateEntry(){
    try{
        const response = await fetch('updateEntry', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                character: document.getElementsByName('character')[0].value,
                phrase: document.getElementsByName('phrase')[0].value,
                season: document.getElementsByName('season')[0].value,
                episode: document.getElementsByName('episode')[0].value,
                // image: document.getElementsByName('image')[0].value,
                // clip: document.getElementsByName('clip')[0].value
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch(err) {
        console.log(err)
    }
}

async function deleteEntry(){
    const input = document.getElementById('deleteInput')
    try{
        const response = await fetch('deleteEntry', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                phrase: input.value
            })
        })
        const data = await response.json()
        location.reload()
    } catch(err) {
        console.log(err)
    }
}