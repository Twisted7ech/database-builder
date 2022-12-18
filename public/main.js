// document.querySelector('#updateButton').addEventListener('click', updateEntry)
document.querySelector('#deleteButton').addEventListener('click', deleteEntry)
document.querySelector('#episodeButton').addEventListener('click', getEpisode)

async function getEpisode(){
    try{
        const episode = document.querySelector('#episodeChoice').value
        const character = document.querySelector('#getChar').value
        const response = await fetch('/api/:' + episode + character)
        const data = await response.json()
    
        console.log(data)
    
        
        document.querySelector('#episodeTitle').innerText = data.title
        document.querySelector('#episodeScript').innerText = data.script
    }
    catch(err) {
        console.error(err)
    }
}
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
                episode: input.value
            })
        })
        const data = await response.json()
        location.reload()
    } catch(err) {
        console.log(err)
    }
}