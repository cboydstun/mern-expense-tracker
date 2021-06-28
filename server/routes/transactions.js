//import middleware
const router = require("express").Router();

//import model
const Transaction = require("../models/Transaction");

// @GET - /api/v1/transactions - Get all transactions - Public
router.get("/", async (req, res, next) => {
  try {
    const transactions = await Transaction.find();
    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
});

// @POST - /api/v1/transactions - Add transaction - Public
router.post("/", async (req, res, next) => {
  try {
    const { text, amount } = req.body;
    const transaction = await Transaction.create(req.body);
    return res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
});

// @PUT - /api/v1/transactions/:id - Edit transaction - Public
router.put('/:id', async(req, res)=>{
    const {text, amount} = req.body;

    const transactionFields = {};
    if(text) transactionFields.text = text;
    if(amount) transactionFields.amount = amount;

    try{
        let transaction = await Transaction.findById(req.params.id);

        if(!transaction) return res.status(404).json({msg:"transaction not found"})

        transaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            {$set: transactionFields},
            {new: true},
        );

        return res.status(201).json({
          success: true,
          data: transaction
        });
      }catch (error) {
        return res.status(500).json({
        success: false,
        error: "Server Error"
      });
    }
})

// @DELETE - /api/v1/transactions/:id - Delete transaction - Public
router.delete("/:id", async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, error: "No transaction found." });
    }

    await transaction.remove();

    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
});

module.exports = router;