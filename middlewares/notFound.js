function notFound (req, res, next) {
    res.status(404) //forzo il codice di risposta corretto
    res.json({ //gestisco errore ritornando una risposta json
        error: "Not found",
        message: "Pagina non trovata"
    });
};

module.exports = notFound