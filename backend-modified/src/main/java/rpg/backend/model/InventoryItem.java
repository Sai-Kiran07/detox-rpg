package rpg.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashMap;
import java.util.Map;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryItem {

    @Id
    private String id;

    private String title;
    private String description;
    private String category;
    private String slot;

    @ElementCollection
    @Builder.Default
    private Map<String, Integer> statBonus = new HashMap<>();

    private String tier;
    private String icon;

    private boolean equipped;
    private boolean usable;

    private String effect;

    private boolean redeemable;
    private boolean redeemed;

    private String redeemedAt;
    private String acquiredAt;
}