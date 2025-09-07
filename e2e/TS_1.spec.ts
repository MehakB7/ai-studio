import { test, expect } from "@playwright/test";

test("SuccessFully generate an image", async ({ page }) => {
  await page.goto("/");
  await page.setInputFiles('input[type="file"]', "e2e/fixtures/test-image.png");
  await page.getByTestId("prompt-input").fill("Hello this is a test prompt");
  await expect(page.getByTestId("summary-prompt")).toBeVisible();
  await page.getByTestId("style").click();
  await page.getByRole("option", { name: "Streetwear" }).click();
  await expect(page.getByTestId("summary-style")).toBeVisible();
  await expect(page.getByText("Your recent creations will")).toBeVisible();
  await page.getByTestId("button-submit").click();
  await expect(page.getByText("PreviewThis is your AI")).toBeVisible();
  await expect(page.getByTestId("result-prompt")).toBeVisible();
  await expect(page.getByTestId("result-prompt")).toHaveText(
    "Hello this is a test prompt"
  );
  await expect(page.getByTestId("history-item-0")).toBeVisible();
  await expect(page.getByTestId("history-prompt-0")).toContainText(
    "Hello this is a test prompt"
  );
});

test("Show latest 5 generated images ", async ({ page }) => {
  let id = 0;
  await page.route("**/api/generate", (route, request) => {
    const postData = JSON.parse(request.postData()!);

    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        status: 200,
        id: id++,
        prompt: postData.prompt,
        style: postData.style,
        imageUrl: "https://picsum.photos/200/300",
        created_at: new Date(),
      }),
    });
  });

  await page.goto("/");

  for (let i = 0; i < 6; i++) {
    await page.setInputFiles(
      'input[type="file"]',
      "e2e/fixtures/test-image.png"
    );
    await page
      .getByTestId("prompt-input")
      .fill(`Hello this is a test prompt No: - ${i + 1}`);
    await page.getByTestId("button-submit").click();
    await expect(
      page.getByTestId(`history-item-${Math.min(i, 4)}`)
    ).toBeVisible();
    await page.getByRole("button", { name: "Close" }).click();
  }
  await expect(page.getByTestId("history-item-4")).toBeVisible();
  await expect(page.getByTestId("history-prompt-4")).toContainText(
    "Hello this is a test prompt No: - 2"
  );
});

test("Should retry 3 times before showing error ", async ({
  page,
  baseURL,
}) => {
  let calledCount = 0;
  await page.route("**/api/generate", (route, request) => {
    ++calledCount;
    route.fulfill({
      status: 429,
      contentType: "application/json",
      body: JSON.stringify({
        status: 429,
        error: "Modal overloaded",
      }),
    });
  });

  await page.goto("/");
  await page.setInputFiles('input[type="file"]', "e2e/fixtures/test-image.png");
  await page
    .getByTestId("prompt-input")
    .fill(`Hello this is a test prompt No: -1`);
  await page.getByTestId("button-submit").click();
  await expect(page.getByTestId("error-toast")).toBeVisible({ timeout: 15000 });
  expect(calledCount).toBe(3);
});
