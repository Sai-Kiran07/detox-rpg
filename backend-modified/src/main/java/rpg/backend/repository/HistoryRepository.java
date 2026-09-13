package rpg.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rpg.backend.model.HistoryEntry;
import rpg.backend.model.User;

import java.util.List;

public interface HistoryRepository extends JpaRepository<HistoryEntry, String> {
    List<HistoryEntry> findByUser(User user);

}