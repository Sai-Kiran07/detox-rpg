package rpg.backend.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import rpg.backend.model.InventoryItem;
import rpg.backend.service.InventoryService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@CrossOrigin ("*")

public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public List<InventoryItem> getInventory() {
        return inventoryService.getInventory();
    }

    @PostMapping("/{id}/equip")
    public Map<String, Object> equipItem(@PathVariable String id) {
        InventoryItem item = inventoryService.equipItem(id);

        return Map.of(
                "id", item.getId(),
                "equipped", item.isEquipped()
        );
    }

    @PostMapping("/{id}/use")
    public Map<String, Object> useItem(@PathVariable String id) {
        return inventoryService.useItem(id);
    }

    @PostMapping("/{id}/redeem")
    public Map<String, Object> redeemItem(@PathVariable String id) {
        InventoryItem item = inventoryService.redeemItem(id);

        return Map.of(
                "id", item.getId(),
                "redeemed", item.isRedeemed(),
                "redeemedAt", item.getRedeemedAt()
        );
    }
}