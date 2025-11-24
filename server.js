const express= require('express');
const app=express();

app.use(express.json());

let totalBudget=0;
let envelopes=[];
let nextId=1;

app.get('/',(req,res)=>{
    res.send('Hello World!')
});

app.get('/envelopes',(req,res)=>{
    res.status(200).json(envelopes)
})

app.get('/envelopes/:id',(req,res)=>{
    const id=Number(req.params.id);

    const envelope=envelopes.find(env=>env.id===id);

    if(!envelope){
        return res.status(404).json({error:'Envelope not found'})
    }

    res.status(200).json(envelope);
})

app.post('/envelopes', (req,res)=>{
    const {title,budget}=req.body;

    if(!title || typeof title!=='string'){
        return res.status(400).json({error:'Title is required and must be a string.'})
    }

    if(budget ===undefined || typeof budget !== 'number'){
        return res.status(400).json({error:'Budget is required and must be a non-negative number.'})
    }

    const newEnvelope={
        id:nextId++,
        title,
        budget
    }

    envelopes.push(newEnvelope);
    totalBudget+=budget;

    res.status(201).json(newEnvelope);
})

app.put('/envelopes/:id', (req,res)=>{
    const id=Number(req.params.id);
    const {amount,title}=req.body;

    const envelope=envelopes.find(env=>env.id===id);

    if(!envelope){
        return res.status(404).json({error:'Envelope not found'})
    }
    if(amount !== undefined){
        if(typeof amount !=='number' || amount <=0){
            return res.status(400).json({error:"Amount must be a positive number."})
        }
        if(amount>envelope.budget){
            return res.status(400).json({error:'Not enough funds in this envelope.'})
        }

        envelope.budget-=amount;
        totalBudget-=amount;
    }

    if (title!==undefined){
        if(typeof title!=='string' || !title.trim()){
            return res.status(40).json({error:'Title must be a non-empty string.'})
        }
        envelope.title=title.trim();
    }
    res.status(200).json(envelope);
})

app.delete('/envelopes/:id',(req,res)=>{
    const id=Number(req.params.id);

    const envelopeToDelete=envelopes.find(env=>env.id===id);
    if(!envelopeToDelete){
        return res.status(400).json({error:'Envelope not found'})
    };
    totalBudget-=envelopeToDelete.budget;

    envelopes=envelopes.filter(env=>env.id!==id);

    res.status(200).json({
        message:'Envelope deleted successfully',
        deletedEnvelope:envelopeToDelete
    })

})

app.post('/envelopes/transfer/:from/:to', (req,res)=>{
    const fromId=Number(req.params.from);
    const toId=Number(req.params.to);
    const {amount}=req.body;

    if(!amount || typeof amount !== 'number' || amount < 0){
        return res.status(400).json({error:'Amount must be a positive number.'})
    }

    const fromEnvelope=envelopes.find(env=>env.id===fromId);
    const toEnvelope=envelopes.find(env=>env.id===toId);

    if(!fromEnvelope){
        return res.status(404).json({error:'Source envelope not found.'})
    }
    if(!toEnvelope){
        return res.status(404).json({error:'Destination envelope not found.'})
    }

    if(fromEnvelope.budget<amount){
        return res.status(400).json({error:'No sufficient funds in the source envelope.'})
    }
    fromEnvelope.budget-=amount;
    toEnvelope.budget+=amount;

    res.status(200).json({
        message:'Transfer complete',
        from:fromEnvelope,
        to:toEnvelope
    })

})




const PORT=3000;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
});


