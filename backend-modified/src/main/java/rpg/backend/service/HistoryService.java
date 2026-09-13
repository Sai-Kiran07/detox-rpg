package rpg.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import rpg.backend.model.HistoryEntry;
import rpg.backend.repository.HistoryRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final HistoryRepository historyRepository;

    public List<HistoryEntry> getHistory() {
        return historyRepository.findAll();
    }

    public HistoryEntry createHistory(HistoryEntry historyEntry) {
        return historyRepository.save(historyEntry);
    }
}