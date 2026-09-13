package rpg.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import rpg.backend.model.HistoryEntry;
import rpg.backend.service.HistoryService;

import java.util.List;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
@CrossOrigin ("*")
public class HistoryController {

    private final HistoryService historyService;

    @GetMapping
    public List<HistoryEntry> getHistory() {
        return historyService.getHistory();
    }

    @PostMapping
    public HistoryEntry createHistory(@RequestBody HistoryEntry historyEntry) {
        return historyService.createHistory(historyEntry);
    }
}