const verifySignUpController = require("../api").verifySignUp;
const verifySignController = require("../api").verifySign;
const verifyJwtTokenController = require("../api").verifyJwtToken;
const model = require("../models/index");
var express = require("express");
const db = require("../models/index");
var router = express.Router();

router.post(
  "/auth/signup",
  [
    verifySignUpController.checkDuplicateUserNameOrEmail,
    verifySignUpController.checkRolesExisted,
  ],
  verifySignController.signup
);

router.post("/auth/signin", verifySignController.signin);
router.post(
  "/auth/role",
  verifyJwtTokenController.verifyToken,
  verifySignController.getRole
);

// GET invoices listing.
router.get("/invoices", async function (req, res, next) {
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

// GET invoices listing.
router.get(
  "/invoices/reports",
  [verifyJwtTokenController.verifyToken, verifyJwtTokenController.isDirector],
  async function (req, res, next) {
    try {
      const invoices = await db.sequelize.query("SELECT * FROM invoices INNER JOIN (SELECT customer_name, MAX(invoice_date) AS 'invoice_date' FROM invoices GROUP BY customer_name) latest_invoice ON invoices.customer_name = latest_invoice.customer_name AND invoices.invoice_date = latest_invoice.invoice_date", {
        type: db.sequelize.QueryTypes.SELECT,
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
  }
);
// GET invoices detail.
router.get(
  "/invoices/:id",
  [
    verifyJwtTokenController.verifyToken,
    verifyJwtTokenController.isLeadOrStaffOrDirector,
  ],
  async function (req, res, next) {
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
  }
);
// POST invoices
router.post(
  "/invoices/",
  [verifyJwtTokenController.verifyToken, verifyJwtTokenController.isStaff],
  async function (req, res, next) {
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
        total,
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
  }
);
// UPDATE invoices
router.patch(
  "/invoices/:id",
  [
    verifyJwtTokenController.verifyToken,
    verifyJwtTokenController.isLeadOrStaff,
  ],
  async function (req, res, next) {
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
          total,
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
  }
);
// DELETE invoices
router.delete(
  "/invoices/:id",
  [verifyJwtTokenController.verifyToken, verifyJwtTokenController.isLead],
  async function (req, res, next) {
    try {
      const invoicesId = req.params.id;

      const invoiceDetails = await model.InvoiceDetails.destroy({
        where: {
          invoiceId: invoicesId,
        },
      });

      if (invoiceDetails) {
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
      }
    } catch (err) {
      res.status(400).json({
        status: "ERROR",
        messages: err.message,
        data: {},
      });
    }
  }
);

function calculateSubtotal(details) {
  let subTotal = 0;

  for (const item of details) {
    subTotal += item.quantity * item.price;
  }

  return subTotal;
}

module.exports = router;

module.exports = router;
