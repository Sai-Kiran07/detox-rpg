package rpg.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rpg.backend.model.InventoryItem;
import rpg.backend.model.User;

import java.util.List;

public interface InventoryRepository extends JpaRepository<InventoryItem, String> {
    List<InventoryItem> findByUser(User user);

}