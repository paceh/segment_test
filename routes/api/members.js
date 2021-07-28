const express = require('express');
const router = express.Router();
const members = require("../../Members");
const uuid = require('uuid');
const moment = require('moment');
// SEGMENT
const analytics = require('../../Segment.js');
// SEGMENT

router.get('/', (req, res) => {
    res.json(members);
});

// Get single member
router.get('/:id', (req, res) => {
    // Checks if id url parameter exists in members array
    const found = members.some(member => member.id === parseInt(req.params.id))
    
    // SEGMENT
    analytics.track({
        anonymousId: '48d213bb-95c3-4f8d-af97-86b2b404dcfe',
        event: 'Member Found',
        properties: {
          id: req.params.id
        }
      });
    // SEGMENT

    // // Check if found is true
    found
    ? res.json(members.filter(member => member.id === parseInt(req.params.id)))
    : res.status(400).send(`No member exists with id ${req.params.id}`);
});

// Create member
router.post('/', (req, res) => {
    const newMember = {
        id: uuid.v4(),
        name: req.body.name,
        email: req.body.email,
        status: 'active'
    }

    if(!newMember.name || !newMember.email) {
        return res.status(400).send('Must include both name and email in request body')
    }

    // SEGMENT
    analytics.track({
        anonymousId: '48d213bb-95c3-4f8d-af97-86b2b404dcfe',
        event: 'Member Created',
        properties: {
          id: newMember.id,
          name: newMember.name,
          email: newMember.email,
          status: newMember.status
        }
      });
    // SEGMENT

    members.push(newMember);
    res.json(members);
});

// Update member
router.put('/:id', (req, res) => {
    // Checks if id url parameter exists in members array
    const found = members.some(member => member.id === parseInt(req.params.id))
    
    // // Check if found is true
    if (found) {
        const updMember = req.body;
        members.forEach(member => {
            if(member.id === parseInt(req.params.id)) {
                member.name = req.body.name ? updMember.name : member.name
                member.email = req.body.email ? updMember.email : member.email

                // SEGMENT
                analytics.track({
                    anonymousId: '48d213bb-95c3-4f8d-af97-86b2b404dcfe',
                    event: 'Member Updated',
                    properties: {
                      id: req.params.id,
                      name: updMember.name,
                      email: updMember.email,
                    }
                });
                // SEGMENT

                res.send(`Member ${member.name} updated`);
            }
        });
    } else {
        res.status(400).send(`No member exists with id ${req.params.id}`);
    }
});

// Delete member
router.delete('/:id', (req, res) => {
    // Checks if id url parameter exists in members array
    const found = members.some(member => member.id === parseInt(req.params.id))
    
    // Check if found is true
    if(found) {

        // SEGMENT
        analytics.track({
            anonymousId: '48d213bb-95c3-4f8d-af97-86b2b404dcfe',
            event: 'Member Deleted',
            properties: {
              id: req.params.id
            }
        });
        // SEGMENT

        res.json({
            msg: 'Member deleted',
            members: members.filter(member => member.id !== parseInt(req.params.id))
        });
    } else {
        res.status(400).send(`No member exists with id ${req.params.id}`);
    }
});

module.exports = router;