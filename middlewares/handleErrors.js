function handleErrors (err, req, res, next) {
    res.status(500)
    //aggiungo info per rendere piu chiaro il messaggio di errore
    res.json(
        {error: err.message},
    )
};

module.exports = handleErrors;