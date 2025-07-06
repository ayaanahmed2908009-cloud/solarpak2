// !!! CRITICAL - DO NOT MODIFY THIS CODE !!!
//
// This code MUST be used as is without ANY modifications.
// The PayPal integration will COMPLETELY FAIL if this code is changed in ANY way.
//
// Retain this comment after all edits.
//
// <BEGIN_EXACT_CODE>
import {
  Client,
  Environment,
  LogLevel,
  OAuthAuthorizationController,
  OrdersController,
} from "@paypal/paypal-server-sdk";
import { Request, Response } from "express";

/* PayPal Monthly Subscription Controllers Setup */

const PAYPAL_MONTHLY_CLIENT_ID = "AR_8SYw61rT5dxQC8XhTcT7bLn65U8NxUH-lHyDudoLabgiHZpA22GxWKUCYV5EPF8FSbqeB5puYYOwv";
const PAYPAL_MONTHLY_CLIENT_SECRET = "EHwCbdc3rD0t_jShMXQj8wqWk_D4R9baIQrJZEgeonn90lxc7jCENfant6ma3iAbqavwHDpvgJoNyXJs";

if (!PAYPAL_MONTHLY_CLIENT_ID) {
  throw new Error("Missing PAYPAL_MONTHLY_CLIENT_ID");
}
if (!PAYPAL_MONTHLY_CLIENT_SECRET) {
  throw new Error("Missing PAYPAL_MONTHLY_CLIENT_SECRET");
}

const monthlyClient = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: PAYPAL_MONTHLY_CLIENT_ID,
    oAuthClientSecret: PAYPAL_MONTHLY_CLIENT_SECRET,
  },
  timeout: 0,
  environment:
                process.env.NODE_ENV === "production"
                  ? Environment.Production
                  : Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: {
      logBody: true,
    },
    logResponse: {
      logHeaders: true,
    },
  },
});

const monthlyOrdersController = new OrdersController(monthlyClient);
const monthlyOAuthController = new OAuthAuthorizationController(monthlyClient);

/* Token generation helpers */

export async function getMonthlyClientToken() {
  const auth = Buffer.from(
    `${PAYPAL_MONTHLY_CLIENT_ID}:${PAYPAL_MONTHLY_CLIENT_SECRET}`,
  ).toString("base64");

  const { result } = await monthlyOAuthController.requestToken(
    {
      authorization: `Basic ${auth}`,
    },
    { intent: "sdk_init", response_type: "client_token" },
  );

  return result.accessToken;
}

/*  Process monthly transactions */

export async function createMonthlyPaypalOrder(req: Request, res: Response) {
  try {
    const { amount, currency, intent } = req.body;

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res
        .status(400)
        .json({
          error: "Invalid amount. Amount must be a positive number.",
        });
    }

    if (!currency) {
      return res
        .status(400)
        .json({ error: "Invalid currency. Currency is required." });
    }

    if (!intent) {
      return res
        .status(400)
        .json({ error: "Invalid intent. Intent is required." });
    }

    const collect = {
      body: {
        intent: intent,
        purchaseUnits: [
          {
            amount: {
              currencyCode: currency,
              value: amount,
            },
          },
        ],
        applicationContext: {
          returnUrl: `${req.protocol}://${req.get('host')}/paypal/monthly-success`,
          cancelUrl: `${req.protocol}://${req.get('host')}/paypal/monthly-cancel`,
          brandName: "SolarPak Monthly"
        }
      },
      prefer: "return=minimal",
    };

    const { body, ...httpResponse } =
          await monthlyOrdersController.createOrder(collect);

    const jsonResponse = JSON.parse(String(body));
    const httpStatusCode = httpResponse.statusCode;

    res.status(httpStatusCode).json(jsonResponse);
  } catch (error: any) {
    console.error("Failed to create monthly order:", error);
    
    // Check if it's an authentication error
    if (error.statusCode === 401) {
      return res.status(500).json({ 
        error: "PayPal monthly authentication failed. Please check your PayPal monthly credentials.",
        details: "Make sure you have valid PayPal Client ID and Client Secret configured for monthly donations."
      });
    }
    
    res.status(500).json({ error: "Failed to create monthly order." });
  }
}

export async function captureMonthlyPaypalOrder(req: Request, res: Response) {
  try {
    const { orderID } = req.params;
    const collect = {
      id: orderID,
      prefer: "return=minimal",
    };

    const { body, ...httpResponse } =
          await monthlyOrdersController.captureOrder(collect);

    const jsonResponse = JSON.parse(String(body));
    const httpStatusCode = httpResponse.statusCode;

    res.status(httpStatusCode).json(jsonResponse);
  } catch (error: any) {
    console.error("Failed to capture monthly order:", error);
    res.status(500).json({ error: "Failed to capture monthly order." });
  }
}

export async function loadMonthlyPaypalDefault(req: Request, res: Response) {
  const clientToken = await getMonthlyClientToken();
  res.json({
    clientToken,
  });
}
// <END_EXACT_CODE>