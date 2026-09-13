package rpg.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import rpg.backend.model.HistoryEntry;
import rpg.backend.model.InventoryItem;
import rpg.backend.model.Prize;
import rpg.backend.model.Profile;
import rpg.backend.repository.HistoryRepository;
import rpg.backend.repository.InventoryRepository;
import rpg.backend.repository.PrizeRepository;
import rpg.backend.repository.ProfileRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PrizeService {

    private final PrizeRepository prizeRepository;
    private final InventoryRepository inventoryRepository;
    private final ProfileRepository profileRepository;
    private final HistoryRepository historyRepository;

    public List<Prize> getPrizes() {
        return prizeRepository.findAll();
    }

    public Prize createPrize(Prize prize) {
        return prizeRepository.save(prize);
    }

    public void deletePrize(String id) {
        prizeRepository.deleteById(id);
    }

    public Map<String, Object> buyPrize(
            String id,
            Map<String, Object> request
    ) {
        Prize prize = prizeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prize not found"));

        Profile profile = profileRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        Integer discountedCost = (Integer) request.getOrDefault(
                "discountedCost",
                prize.getCost()
        );

        if (profile.getTickets() < discountedCost) {
            throw new RuntimeException("Not enough tickets");
        }

        profile.setTickets(profile.getTickets() - discountedCost);

        InventoryItem item = InventoryItem.builder()
                .id(UUID.randomUUID().toString())
                .title(prize.getTitle())
                .description(prize.getDescription())
                .category(prize.getCategory())
                .slot(prize.getSlot())
                .statBonus(prize.getStatBonus())
                .tier(prize.getTier())
                .icon(prize.getIcon())
                .equipped(false)
                .usable(prize.isUsable())
                .effect(prize.getEffect())
                .redeemable(prize.isRedeemable())
                .redeemed(false)
                .acquiredAt(LocalDateTime.now().toString())
                .build();

        inventoryRepository.save(item);
        profileRepository.save(profile);

        HistoryEntry history = HistoryEntry.builder()
                .type("prize_claimed")
                .title(prize.getTitle())
                .details("Purchased from prize shop")
                .ticketsSpent(discountedCost)
                .timestamp(LocalDateTime.now().toString())
                .build();

        historyRepository.save(history);

        return Map.of(
                "inventoryItem", item,
                "profile", profile,
                "historyEntry", history
        );
    }
}