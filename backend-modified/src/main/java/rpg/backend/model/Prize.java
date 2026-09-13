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
public class Prize {

    @Id
    private String id;

    private String title;
    private String description;
    private Integer cost;
    private String tier;
    private String category;
    private String icon;
    private String slot;

    @ElementCollection
    @Builder.Default
    private Map<String, Integer> statBonus = new HashMap<>();

    private boolean usable;
    private String effect;
    private boolean redeemable;
}