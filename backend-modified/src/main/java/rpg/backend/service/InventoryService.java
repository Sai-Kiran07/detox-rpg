package rpg.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import rpg.backend.dto.UserRepository;
import rpg.backend.model.InventoryItem;
import rpg.backend.model.Profile;
import rpg.backend.model.User;
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
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<InventoryItem> getInventory() {
        User user = getCurrentUser();

        return inventoryRepository.findByUser(user);
    }

    public InventoryItem equipItem(String id) {
        User user = getCurrentUser();

        InventoryItem item = getItem(id);

        if (!item.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Inventory item not found");
        }

        System.out.println(item.getCategory());

        item.setEquipped(!item.isEquipped());

        return inventoryRepository.save(item);
    }

    public Map<String, Object> useItem(String id) {
        User user = getCurrentUser();

        InventoryItem item = getItem(id);

        if (!item.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Inventory item not found");
        }

        if (!item.isUsable()) {
            throw new RuntimeException("Item cannot be used");
        }

        Profile profile = profileRepository.findByUser(user)
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
        User user = getCurrentUser();

        InventoryItem item = getItem(id);

        if (!item.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Inventory item not found");
        }

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