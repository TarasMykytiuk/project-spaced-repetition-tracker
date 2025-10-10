import { renderAgenda } from "./script.mjs";
import assert from "node:assert";
import test from "node:test";

test("Agenda rendered", () => {
    const mockAgendaList = { innerHTML: "" };
    let mockData = [
        {
            "topic": "test topic",
            "date": "2025-10-15"
        },
        {
            "topic": "test topic",
            "date": "2025-11-08"
        },
        {
            "topic": "test topic",
            "date": "2026-01-08"
        },
        {
            "topic": "test topic",
            "date": "2026-04-08"
        },
        {
            "topic": "test topic",
            "date": "2026-10-08"
        }
    ]
    const currentDate = new Date();
    renderAgenda(mockData, currentDate, mockAgendaList);
    assert.equal(mockAgendaList.innerHTML, '<li><time datetime="2025-10-15">2025-10-15</time> — test topic</li><li><time datetime="2025-11-08">2025-11-08</time> — test topic</li><li><time datetime="2026-01-08">2026-01-08</time> — test topic</li><li><time datetime="2026-04-08">2026-04-08</time> — test topic</li><li><time datetime="2026-10-08">2026-10-08</time> — test topic</li>', "New topic rendered");
});
