const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('./../helpers/auth');
const mongoose = require('mongoose');
const Story = mongoose.model('Story');
const User = mongoose.model('User');

// Stories index
router.get('/', (req, res) => {
  Story.find({status: 'public'})
    .populate('user') //populate user with all fields in User model.
    .then(stories => {
      res.render('stories/index', {stories});
    })
});

// show single story
router.get('/show/:id', (req, res) => {
  Story.findOne({_id: req.params.id})
    .populate('user')
    .then(story => {
      res.render('stories/show', {
        story
      });
    });
})

// add story form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

// edit story form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({_id: req.params.id})
    .then(story => {
      res.render('stories/edit', {
        story
      });
    });
});

// process add story
router.post('/', (req, res) => {
  let allowComments;

  if(req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }

  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user.id
  };

  // Create story
  new Story(newStory).save()
    .then(story => {
      res.redirect(`/stories/show/${story._id}`);
    })
})

router.get('/edit', (req, res) => {
  res.render('stories/edit');
});

router.get('/show', (req, res) => {
  res.render('stories/show');
});

// Edit form process
router.put('/:id', (req, res) => {
  Story.findOne({_id: req.params.id})
    .then(story => {
      let allowComments;

      if(req.body.allowComments) {
        allowComments = true;
      } else {
        allowComments = false;
      }
      
      // new values
      story.title = req.body.title;
      story.body = req.body.body;
      story.status = req.body.status;
      story.allowComments = allowComments;

      story.save()
        .then(story => {
          res.redirect('/dashboard');
        });
    });
});

// Delete story
router.delete('/:id', (req, res) => {
  Story.remove({_id: req.params.id})
    .then(() => {
      res.redirect('/dashboard');
    });
});

// add comment
router.post('/comment/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then(story => {
    const newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id
    }

    // Add to comments array
    story.comments.unshift(newComment); // use unshift to add to the beginning
    story.save().then(story => {
      res.redirect(`/stories/show/${story.id}`);
    })
  })
});


module.exports = router;