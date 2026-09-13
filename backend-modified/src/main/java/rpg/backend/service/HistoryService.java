package rpg.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import rpg.backend.dto.UserRepository;
import rpg.backend.model.HistoryEntry;
import rpg.backend.model.User;
import rpg.backend.repository.HistoryRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final HistoryRepository historyRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<HistoryEntry> getHistory() {
        User user = getCurrentUser();

        return historyRepository.findByUser(user);
    }

    public HistoryEntry createHistory(HistoryEntry history) {
        User user = getCurrentUser();

        history.setUser(user);

        return historyRepository.save(history);
    }
}