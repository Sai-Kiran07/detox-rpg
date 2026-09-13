package rpg.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rpg.backend.model.InventoryItem;

public interface InventoryRepository extends JpaRepository<InventoryItem, String> {
}