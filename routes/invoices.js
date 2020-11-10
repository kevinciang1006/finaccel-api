const express = require("express");
const router = express.Router();
const model = require("../models/index");
// GET invoices listing.
router.get("/", async function (req, res, next) {
  try {
    const invoices = await model.invoices.findAll({ include: "details" });
    if (invoices.length !== 0) {
      res.json({
        status: "OK",
        messages: "",
        data: invoices,
      });
    } else {
      res.json({
        status: "ERROR",
        messages: "EMPTY",
        data: {},
      });
    }
  } catch (err) {
    res.json({
      status: "ERROR",
      messages: err.messages,
      data: {},
    });
  }
});
// GET invoices detail.
router.get("/:id", async function (req, res, next) {
  try {
    const invoicesId = req.params.id;
    const invoices = await model.invoices.findOne({
      where: {
        id: invoicesId,
      },
      include: "details",
    });
    if (invoices.length !== 0) {
      res.json({
        status: "OK",
        messages: "",
        data: invoices,
      });
    } else {
      res.json({
        status: "ERROR",
        messages: "EMPTY",
        data: {},
      });
    }
  } catch (err) {
    res.json({
      status: "ERROR",
      messages: err.messages,
      data: {},
    });
  }
});
// POST invoices
router.post("/", async function (req, res, next) {
  try {
    const {
      customer_name,
      customer_address,
      customer_phone,
      tax,
      invoiceDetails,
    } = req.body;
    
    const subTotal = calculateSubtotal(invoiceDetails);
    const taxTotal = (subTotal * tax) / 100;
    const total = subTotal + taxTotal;

    const invoices = await model.invoices.create({
      customer_name,
      customer_address,
      customer_phone,
      tax,
      total
    });
    if (invoices) {
      for (const item of invoiceDetails) {
        item.invoiceId = invoices.id;
      }
      const _invoiceDetails = await model.InvoiceDetails.bulkCreate(
        invoiceDetails
      );

      if (_invoiceDetails) {
        res.json({
          status: "OK",
          messages: "Invoice berhasil ditambahkan",
          data: invoices,
        });
      }
    }
  } catch (err) {
    res.status(400).json({
      status: "ERROR",
      messages: err.message,
      data: {},
    });
  }
});
// UPDATE invoices
router.patch("/:id", async function (req, res, next) {
  try {
    const invoicesId = req.params.id;
    const {
      customer_name,
      customer_address,
      customer_phone,
      tax,
      invoiceDetails,
    } = req.body;

    console.log(req.body);

    const subTotal = calculateSubtotal(invoiceDetails);
    const taxTotal = (subTotal * tax) / 100;
    const total = subTotal + taxTotal;

    const invoices = await model.invoices.update(
      {
        customer_name,
        customer_address,
        customer_phone,
        tax,
        total
      },
      {
        where: {
          id: invoicesId,
        },
      }
    );
    if (invoices) {
      const _invoiceDetails = await model.InvoiceDetails.bulkCreate(
        invoiceDetails,
        { updateOnDuplicate: ["name", "quantity", "price"] }
      );

      if (_invoiceDetails) {
        res.json({
          status: "OK",
          messages: "Invoice berhasil diupdate",
          data: invoices,
        });
      }
    }
  } catch (err) {
    res.status(400).json({
      status: "ERROR",
      messages: err.message,
      data: {},
    });
  }
});
// DELETE invoices
router.delete("/:id", async function (req, res, next) {
  try {
    const invoicesId = req.params.id;
    const invoices = await model.invoices.destroy({
      where: {
        id: invoicesId,
      },
    });
    if (invoices) {
      res.json({
        status: "OK",
        messages: "Invoice berhasil dihapus",
        data: invoices,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "ERROR",
      messages: err.message,
      data: {},
    });
  }
});

function calculateSubtotal(details) {
  let subTotal = 0;

  for (const item of details) {
    subTotal += item.quantity * item.price;
  }

  return subTotal;
}

module.exports = router;
