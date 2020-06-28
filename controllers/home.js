var mongoose = require('mongoose');
var webpost = mongoose.model('webpost');

const updateNewsOffers = function (req, res) {
    var webpostSearch = webpost.find({}, function (error, data) {
        var offer = {}; offer.title = ""; offer.description = ""; offer.image = "";
        var news = {}; news.title = ""; news.description = ""; news.image = "";
        for (var i = 0; i < data.length; i++) {
            if (data[i].isSet && data[i].type === 'News') {
                if (data[i].title !== undefined)
                    news.title = data[i].title;
                if (data[i].image !== undefined)
                    news.image = data[i].image;
                if (data[i].description !== undefined)
                    news.description = data[i].description;

                    console.log("NEWS: " + news.title);
            }
            
            if (data[i].isSet && data[i].type === 'Offer') {
                if (data[i].title !== undefined)
                    offer.title = data[i].title;
                if (data[i].image !== undefined)
                    offer.image = data[i].image;
                if (data[i].description !== undefined)
                    offer.description = data[i].description;

                    console.log("OFFER: " + news.title);
            }
        }
        res.render('home', {
            title: 'Home',
            offerTitle: offer.title,
            offerDescription: offer.description,
            offerImage: "\"uploads\/" + offer.image + "\"",
            newsTitle: news.title,
            newsDescription: news.description,
            newsImage: "\"uploads\/" + news.image + "\""
        });
    });
}

module.exports = {
    updateNewsOffers
}