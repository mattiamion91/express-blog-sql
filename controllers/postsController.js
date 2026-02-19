//importo il file di connessione al db
const connection = require('../data/db')

//importo sita posts da posts.js (per il momento lo mantengo assieme al file connessione db)
const listaPosts = require('../data/postsList')

// Index
function index(req, res) {
    // prepariamo la query
    const sql = 'SELECT * FROM posts';
    // eseguiamo la query!
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json(results);
    });
}

function show(req, res) {
    // recuperiamo l'id dall' URL
    const id = req.params.id
    const sql = 'SELECT * FROM posts WHERE id = ?';
    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (results.length === 0) return res.status(404).json({ error: 'post not found' });
        res.json(results[0]);
    });
}
function store(req, res) {
    //creo id univoco usado metodo date e gli attuali milliscondi a partire dal 1 gennaio 1970
    const newId = Date.now();
    // Creiamo un nuovo oggetto post
    const newPost = {
        id: newId,
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        tags: req.body.tags,
    }
    // Aggiungiamo il nuovo post alla lista
    listaPosts.push(newPost);
    // controlliamo in console che stampa array oggetti aggiornato
    console.log(listaPosts);
    // Restituiamo lo status corretto e il post
    res.status(201);
    res.json(newPost);
    //console.log(req.body); // log per stampare in terminale di dati in arrivo
    //res.send('Creazione nuovo post'); //da questa rotta di crud uso res.send perche mi restitusce un messaggio/html, sopra uso res.json perche mi deve tornare un oggetto json
}

function update(req, res) {
    //rendo utilizzabile singolo post usando id
    const postById = parseInt(req.params.id) //uso parse int perche req.params.id mi sertitusce una stringa e io ho bisogna di un numero per rendere vera l'uguaglianza stretta (non ci sarei mai arrivato da solo!)
    //cerco post specifico usando metodo 'find' e usando id specifico recuerparo con req.params.id
    const myPost = listaPosts.find((post) => post.id === postById) //sintasssi meootdo find copiata da mdn
    if (!myPost) { //SE  myPost non esiste NOT ritorna messaggio di errore
        return res.status(404).json({
            error: 'not found - errore 404',
            message: 'prodotto non trovato'
        });
    }
    //aggiurno il post riassegnando valori delle proprita allinterno dell'oggetto
    myPost.title = req.body.title;
    myPost.content = req.body.content
    myPost.image = req.body.image
    myPost.tags = req.body.tags
    //controllo
    console.log(listaPosts);
    //restitrusco jsno post appena aggiornato
    res.json(myPost)
    //res.send('Modifica integrale del post ' + req.params.id);
}

function modify(req, res) {
    //rendo utilizzabile singolo post usando id
    const postById = parseInt(req.params.id) //uso parse int perche req.params.id mi sertitusce una stringa e io ho bisogna di un numero per rendere vera l'uguaglianza stretta (non ci sarei mai arrivato da solo!)
    /*// introduciamo un errore a caso per test middelware err 500
        throw new Error("Errore di test middleware");*/
    //cerco post specifico usando metodo 'find' e usando id specifico recuerparo con req.params.id
    const myPost = listaPosts.find((post) => post.id === postById) //sintasssi meootdo find copiata da mdn
    if (!myPost) { //SE  myPost non esiste NOT ritorna messaggio di errore
        return res.status(404).json({
            error: 'not found - errore 404',
            message: 'prodotto non trovato'
        });
    }
    //aggiurno il post riassegnando valori delle proprita all'interno dell'oggetto
    /* req.body.title ? myPost.title = req.body.title : myPost.title = myPost.title //req.body.title esiste? se si (true) assegna nuvo valore se no (fasle) restitusci il valore inizilate
    if (req.body.content) { //stessa cosa ma usando if
        myPost.content = req.body.content
    }
    req.body.image ? myPost.image = req.body.image : myPost.image = myPost.image
    if (req.body.tags) {
        myPost.tags = req.body.tags
    } */
    //devo ciclare tutte le proprieta presenti nel mio oggetto for...in per le proprita degli oggetti! 
    /* for (let proprieta in req.body) { //prendo tutte le porprieta prendeti nel mio oggetto inviato col verbo http patch da postman (req.body)
        console.log(proprieta);
        myPost[proprieta] = req.body[proprieta] //se la propirta del mio oggetto ciclato é presente nelle proprita dell'oggetto la riassegno DEVO USARE LA BRACKET NOT NON DOT NOT!!
    } */
    const modificabili = ["title", "content", "image", "tags"] //dicharo un array con dentro le prop modificavili
    modificabili.forEach(proprieta => { //posso usare forEach su array prop
        if (req.body[proprieta]) { //se la prop dichirata esiste 
            myPost[proprieta] = req.body[proprieta] //riassegna il vaolre
        }
    });
    //controllo lista modificata
    console.log(listaPosts);
    //restitrusco json post appena aggiornato
    res.json(myPost)
    //res.send('Modifica parziale del post ' + req.params.id);
}

function destroy(req, res) {
    // recuperiamo l'id dall' URL
    const { id } = req.params;
    //Eliminiamo il post dal menu
    connection.query('DELETE FROM posts WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to delete posts' });
        res.sendStatus(204)
    });
}
// esportiamo tutto
module.exports = { index, show, store, update, modify, destroy }