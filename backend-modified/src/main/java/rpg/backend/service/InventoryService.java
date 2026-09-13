package rpg.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import rpg.backend.model.InventoryItem;
import rpg.backend.model.Profile;
import rpg.backend.repository.InventoryRepository;
import rpg.backend.repository.ProfileRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProfileRepository profileRepository;

    public List<InventoryItem> getInventory() {
        return inventoryRepository.findAll();
    }

    public InventoryItem equipItem(String id) {
        InventoryItem item = getItem(id);
        System.out.println(item.getCategory());


        item.setEquipped(!item.isEquipped());

        return inventoryRepository.save(item);
    }

    public Map<String, Object> useItem(String id) {
        InventoryItem item = getItem(id);

        if (!item.isUsable()) {
            throw new RuntimeException("Item cannot be used");
        }

        Profile profile = profileRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        applyEffect(item, profile);

        profileRepository.save(profile);

        return Map.of(
                "consumed", true,
                "effect", item.getEffect(),
                "profile", profile
        );
    }

    public InventoryItem redeemItem(String id) {
        InventoryItem item = getItem(id);

        if (!item.isRedeemable()) {
            throw new RuntimeException("Item cannot be redeemed");
        }

        if (item.isRedeemed()) {
            throw new RuntimeException("Item already redeemed");
        }

        item.setRedeemed(true);
        item.setRedeemedAt(LocalDateTime.now().toString());

        return inventoryRepository.save(item);
    }

    private InventoryItem getItem(String id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory item not found"));
    }

    private void applyEffect(InventoryItem item, Profile profile) {
        if (item.getEffect() == null) {
            return;
        }

        if (item.getEffect().contains("Streak Shield")) {
            profile.setStreakShields(profile.getStreakShields() + 1);
        }
    }
}