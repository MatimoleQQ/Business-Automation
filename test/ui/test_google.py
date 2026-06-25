from playwright.sync_api import Page


def test_google_search(page: Page):
    page.goto("https://www.google.com")

    page.fill("input[name='q']", "python QA automation")
    page.keyboard.press("Enter")

    page.wait_for_timeout(2000)

    results = page.locator("#search .g")

    assert results.count() > 0